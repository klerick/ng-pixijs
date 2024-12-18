import {
  inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  RendererType2,
  ɵComponentDef as ComponentDef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { PixijsRenderer } from './pixijs.renderer';
import { CANVAS_ELEMENT_STORAGE, IS_PIXIJS } from '../constants';

export function isComponentDef<T>(def: RendererType2): def is ComponentDef<T> {
  return !!(def as ComponentDef<T>).template;
}

@Injectable()
export class PixijsRendererFactory implements RendererFactory2 {
  private delegateRendererFactory = inject(RendererFactory2, {
    skipSelf: true,
  });
  private document = inject(DOCUMENT);
  private canvasElementStorage = inject(CANVAS_ELEMENT_STORAGE);

  private rendererMap = new Map<string, Renderer2>();

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    const delegateRenderer = this.delegateRendererFactory.createRenderer(
      hostElement,
      type
    );

    if (!type) return delegateRenderer;

    if (
      !(
        isComponentDef(type) &&
        Object.prototype.hasOwnProperty.call(type['type'], IS_PIXIJS)
      )
    ) {
      return delegateRenderer;
    }

    let renderer = this.rendererMap.get(type.id);
    if (renderer) return renderer;

    renderer = new PixijsRenderer(
      delegateRenderer,
      this.canvasElementStorage as any,
      false
    );

    this.rendererMap.set(type.id, renderer);
    return renderer;
  }
}
