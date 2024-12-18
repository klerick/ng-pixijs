import { Type } from '@angular/core';
import { getSelectorFrom, setCustomProps, setDefaultProps } from '../utils';
import {
  CanvasElementStorage,
  CONTAINER,
  ELEMENT,
  IS_PIXIJS,
  PixiComponent,
  PIXIJS_TYPE,
} from '../constants';
import { Container } from 'pixi.js';

export function PixiContainer<
  T extends Type<PixiComponent<C>>,
  C extends Container = Container
>(isStage = false, element?: Type<C>): (target: T) => T {
  return function (target: T): T {
    const selectors = getSelectorFrom(target, 'ɵcmp');

    for (const selector of selectors) {
      CanvasElementStorage.set(selector, element || Container);
      if (isStage) {
        // @ts-expect-error patch Angular component
        target['ɵcmp']['selectors'] = target['ɵcmp']['selectors'].map((i) =>
          // @ts-expect-errore patch Angular component
          i.map((a) => 'stage-' + a)
        );
        CanvasElementStorage.set('stage-' + selector, target);
      }
    }
    setDefaultProps(target);

    const resultTarget = setCustomProps(target, IS_PIXIJS, true);
    return setCustomProps(resultTarget, PIXIJS_TYPE, CONTAINER);
  };
}

export function PixiElement<
  T extends Type<PixiComponent<C>>,
  C extends Container = Container
>(element: Type<C>): (target: T) => T {
  return function (target: T): T {
    const selectors = getSelectorFrom(target, 'ɵdir');
    for (const selector of selectors) {
      CanvasElementStorage.set(selector, element);
    }
    setDefaultProps(target);
    const resultTarget = setCustomProps(target, IS_PIXIJS, true);
    return setCustomProps(resultTarget, PIXIJS_TYPE, ELEMENT);
  };
}
