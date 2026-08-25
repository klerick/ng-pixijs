import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
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

  pixiJsConfig = input<
    Partial<Omit<ApplicationOptions, 'resizeTo' | 'canvas'>>
  >({});

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
      .then(() => {
        this.pixiJsInit.set(true);
      });
  }

  ngOnDestroy(): void {
    // `init()` may still be pending, or have rejected outright -- jsdom offers
    // neither WebGL nor a 2d context. `renderer` is unset in that state and
    // `destroy()` throws, which surfaces to consumers as a failed test teardown.
    if (this.application.renderer) {
      this.application.destroy();
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
  }
}
