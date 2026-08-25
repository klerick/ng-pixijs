import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Application, ApplicationOptions } from 'pixi.js';

import {
  CANVAS_ELEMENT_STORAGE,
  CanvasElementStorage,
  PIXI_APPLICATION_INIT,
} from './constants';

/**
 * The canvas and the pixi `Application` that draws into it.
 *
 * Wraps a `<canvas>` and builds an `Application` over it from `afterNextRender`,
 * which means the scene is a browser-only thing: nothing is built on the server,
 * and the host carries `ngSkipHydration` of its own. The application is provided
 * to everything inside the scene, so a stage and its components reach it through
 * DI rather than through inputs.
 *
 * The scene sizes itself to its host element, so give that host a height --
 * a box with no height hands pixi a zero-sized renderer.
 *
 * ```html
 * <pixi-scene
 *   [pixiJsConfig]="{ backgroundAlpha: 0 }"
 *   (pixiInit)="ready($event)"
 *   (initError)="failed($event)"
 * >
 *   <app-my-stage stage />
 * </pixi-scene>
 * ```
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'pixi-scene',
  imports: [],
  template: ` <canvas #pixiCanvas style="display: block;"></canvas> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    ngSkipHydration: 'true',
  },
  standalone: true,
  providers: [
    {
      provide: Application,
      useFactory: () => new Application(),
    },
    {
      provide: PIXI_APPLICATION_INIT,
      useFactory: () => signal(false),
    },
    {
      provide: CANVAS_ELEMENT_STORAGE,
      useValue: CanvasElementStorage,
    },
  ],
})
export class PixiSceneComponent implements OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly application = inject(Application);
  private readonly document = inject(DOCUMENT);
  private readonly pixiJsInit = inject(PIXI_APPLICATION_INIT);

  private pixiCanvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('pixiCanvas');

  /**
   * Options handed to `Application.init()`.
   *
   * `resizeTo` and `canvas` are omitted because the scene owns both -- it sizes
   * itself to its host element and draws into its own canvas. Everything else is
   * pixi's, and pixi reads these options ONCE, at init: changing the signal later
   * does not reconfigure a running application.
   */
  pixiJsConfig = input<
    Partial<Omit<ApplicationOptions, 'resizeTo' | 'canvas'>>
  >({});

  /**
   * The pixi `Application`, once it has started.
   *
   * Answers one question only -- did the application come up -- and hands the
   * instance to whoever owns this scene, so the surrounding component can drive
   * it without reaching in through a stage. What the scene *contains* stays the
   * business of the stage and its own components.
   */
  pixiInit = output<Application>();

  /**
   * The reason `Application.init()` rejected.
   *
   * A canvas needs a working WebGL or 2d context, and there are places with
   * neither: jsdom, hardware acceleration turned off, some headless browsers.
   * The scene reports the failure instead of leaving a dead canvas behind, so a
   * consumer can render a fallback. `pixiInit` never fires in that case and the
   * init signal stays false, so component `onPixiInit` hooks do not run against
   * an application that was never built.
   */
  initError = output<unknown>();

  /** @internal */
  constructor() {
    afterNextRender({ write: () => this.createApplication() });
  }

  private createApplication() {
    this.application
      .init({
        autoDensity: true,
        resolution: this.document.defaultView
          ? this.document.defaultView.devicePixelRatio
          : 1,
        antialias: true,
        ...this.pixiJsConfig(),
        resizeTo: this.elementRef.nativeElement,
        canvas: this.pixiCanvas().nativeElement,
      })
      .then(
        () => {
          this.pixiJsInit.set(true);
          this.pixiInit.emit(this.application);
        },
        // Two-argument `then` rather than a trailing `catch`: this handler is for
        // `init()` failing and nothing else, so it cannot mistake a fault in the
        // success path for a failed initialisation.
        (error: unknown) => {
          // Logged as well as emitted -- an unhandled rejection at least made the
          // failure loud, and a scene that reports only to a listener nobody
          // registered would be quieter than what it replaces.
          console.error(
            '[ng-pixijs] PixiJS application failed to start',
            error
          );
          this.initError.emit(error);
        }
      );
  }

  /** @internal Angular calls this; consumers never do. */
  ngOnDestroy(): void {
    // `init()` may still be pending, or have rejected outright -- jsdom offers
    // neither WebGL nor a 2d context. `renderer` is unset in that state and
    // `destroy()` throws, which surfaces to consumers as a failed test teardown.
    if (this.application.renderer) {
      this.application.destroy();
    }
  }

  /** @internal Suppresses the browser menu over the canvas. */
  @HostListener('contextmenu', ['$event'])
  onRightClick(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
  }
}
