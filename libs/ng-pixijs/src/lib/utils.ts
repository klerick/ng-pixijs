import {
  DestroyRef,
  ElementRef,
  inject,
  Type,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter } from 'rxjs';

import { Application, Text } from 'pixi.js';
import {
  PIXI_APP_PROPS_NAME,
  PIXI_APPLICATION_INIT,
  PIXI_ELEMENT_PROPS_NAME,
  PIXI_ON_INIT_PROPS_NAME,
  PIXI_ON_RENDER_PROPS_NAME,
} from './constants';

export function getSelectorFrom(
  target: any,
  props: 'ɵdir' | 'ɵcmp'
): Set<string> {
  const type = props === 'ɵdir' ? 'Directive' : 'Component';
  if (!(props in target)) {
    throw new Error(`Class should be decorated with @${type}`);
  }

  if (typeof target[props] !== 'object' || !target[props]) {
    throw new Error(`@${type} should be have options`);
  }

  if (!('selectors' in target[props])) {
    throw new Error(`@${type} should be have selectors`);
  }
  const selectorArray = (
    Array.isArray(target[props]['selectors'])
      ? target[props]['selectors']
      : [target[props]['selectors']]
  ) as string[];
  return selectorArray.reduce((acc, selector) => {
    (Array.isArray(selector) ? selector : [selector]).forEach((selector) =>
      acc.add(selector)
    );
    return acc;
  }, new Set<string>());
}

export function setDefaultProps(target: any): any | null {
  if (!('ɵfac' in target && typeof target['ɵfac'] === 'function')) return;
  const factory = target['ɵfac'];
  target['ɵfac'] = function (...args: any[]) {
    const nativeElement = inject(ElementRef).nativeElement;
    const application = inject(Application);
    const appInit = inject(PIXI_APPLICATION_INIT);
    const instance = factory(...args);
    instance[PIXI_ELEMENT_PROPS_NAME] = nativeElement;
    instance[PIXI_APP_PROPS_NAME] = application;
    if (instance[PIXI_ON_RENDER_PROPS_NAME]) {
      nativeElement[PIXI_ON_RENDER_PROPS_NAME] =
        instance['onRender'].bind(instance);
    }
    if (instance[PIXI_ON_INIT_PROPS_NAME]) {
      const destroyRef = inject(DestroyRef);
      const appInitSubscription = toObservable(appInit)
        .pipe(distinctUntilChanged(), filter(Boolean))
        .subscribe(() => instance[PIXI_ON_INIT_PROPS_NAME]());
      destroyRef.onDestroy(() => appInitSubscription.unsubscribe());
    }
    return instance;
  };
}

export function setCustomProps<T extends Type<any> | any>(
  target: T,
  symbol: symbol | string,
  value: boolean | string | ((...args: any[]) => any) | any
): T {
  if (Object.prototype.hasOwnProperty.call(target, symbol)) return target;
  Object.defineProperty(target, symbol, { value, writable: false });
  return target;
}

export class TextValue {
  constructor(private _text = '', private _textNode?: Text) {}

  set textNode(text: Text) {
    this._textNode = text;
  }

  get textNode(): Text | undefined {
    return this._textNode;
  }

  get value(): string {
    return this._text;
  }
}
