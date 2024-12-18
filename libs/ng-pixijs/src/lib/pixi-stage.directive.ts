import {
  ComponentRef,
  createEnvironmentInjector,
  Directive,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  inject,
  Injector,
  makeEnvironmentProviders,
  OnDestroy,
  OnInit,
  output,
  OutputEmitterRef,
  OutputRefSubscription,
  RendererFactory2,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { injectAutoEffect } from './signals';
import { Application, Container, ContainerChild } from 'pixi.js';

import { PixijsRendererFactory } from './service/pixijs-renderer-factory';
import {
  CANVAS_ELEMENT_STORAGE,
  CanvasElementStorage,
  IS_PIXIJS,
  PIXI_APPLICATION_INIT,
  PixiComponent,
} from './constants';

type OutputObject<K extends string> = {
  [key in K]: EventEmitter<unknown> | OutputEmitterRef<unknown>;
};

function assertKeInInInstance<K extends string>(
  component: any,
  prop: K
): component is OutputObject<K> {
  return (
    component[prop] instanceof EventEmitter ||
    component[prop] instanceof OutputEmitterRef
  );
}

function assertIsPixiComponentType(
  type: Type<
    Container<ContainerChild> | PixiComponent<Container<ContainerChild>>
  >
): type is Type<PixiComponent> {
  return Object.prototype.hasOwnProperty.call(type, IS_PIXIJS);
}

@Directive({
  selector: '[stage]',
  standalone: true,
})
export class PixiStageDirective implements OnInit, OnDestroy {
  private readonly autoEffect = injectAutoEffect();
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly elementRef = inject(ElementRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);
  private readonly application = inject(Application);
  private readonly pixiJsInit = inject(PIXI_APPLICATION_INIT);
  private readonly canvasElementStorage = inject(CANVAS_ELEMENT_STORAGE);
  private readonly eventListeners: {
    [key: string]: EventListenerOrEventListenerObject[];
  } = {};

  constructor() {
    const nativeElement = this.elementRef.nativeElement;
    const originalAddEventListener =
      nativeElement.addEventListener.bind(nativeElement);

    nativeElement.addEventListener = (
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => {
      if (!this.eventListeners[type]) {
        this.eventListeners[type] = [];
      }
      this.eventListeners[type].push(listener);
      originalAddEventListener(type, listener, options);
    };
  }

  private sceneEnvironmentInjector = createEnvironmentInjector(
    [
      makeEnvironmentProviders([
        { provide: RendererFactory2, useClass: PixijsRendererFactory },
        {
          provide: CANVAS_ELEMENT_STORAGE,
          useValue: CanvasElementStorage,
        },
      ]),
    ],
    this.environmentInjector
  );

  outputsEvent = output<{ eventName: string; eventData: any }>();
  outputRefSubscription: OutputRefSubscription[] = [];

  stageRef?: ComponentRef<PixiComponent>;

  private runStage() {
    if (!this.pixiJsInit()) return;
    this.ngOnDestroy();
    const stage = this.canvasElementStorage.get(
      'stage-' + this.elementRef.nativeElement.tagName.toLocaleLowerCase()
    );

    if (!stage) {
      throw new Error(
        'Component not found, you should use the @PixiComponent(true) decorator'
      );
    }

    if (!assertIsPixiComponentType(stage)) {
      throw new Error(
        'Component not found, you should use the @PixiComponent(true) decorator'
      );
    }


    this.stageRef = this.viewContainerRef.createComponent(stage, {
      environmentInjector: this.sceneEnvironmentInjector,
      injector: this.injector,
    });

    if (!this.stageRef) {
      throw new Error('Component not found');
    }
    const instance = this.stageRef.instance;
    const outputs = this.getOutputs(instance);
    this.outputRefSubscription = outputs
      .map((outputProp) => {
        if (!assertKeInInInstance(instance, outputProp)) return null;

        return instance[outputProp].subscribe((eventData: any) => {
          for (const item of this.eventListeners[outputProp]) {
            if (typeof item !== 'function') continue;
            item(eventData);
          }
        });
      })
      .filter((i): i is OutputRefSubscription => !!i);

    this.application.stage.addChild(this.stageRef.location.nativeElement);
    this.stageRef.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.autoEffect(() => {
      try {
        this.runStage();
      } catch (e) {
        console.error(e);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.stageRef) {
      this.application.stage.removeChild(this.stageRef.location.nativeElement);
      this.stageRef.destroy();
    }
    for (const i of this.outputRefSubscription) {
      i.unsubscribe();
    }
  }

  private getOutputs(componentInstance: any): string[] {
    const outputs: string[] = [];
    for (const prop in componentInstance) {
      if (
        assertKeInInInstance(componentInstance, prop) &&
        this.eventListeners[prop]
      ) {
        outputs.push(prop);
      }
    }
    return outputs;
  }
}
