import {
  Container,
  ContainerChild,
  Sprite,
  TilingSprite,
  Text,
  Graphics,
  Application,
} from 'pixi.js';
import { InjectionToken, Type, WritableSignal } from '@angular/core';

export const prefix = 'pixi' as const;

export const IS_PIXIJS = Symbol('IS_PIXIJS');
export const PIXIJS_TYPE = Symbol('PIXIJS_TYPE');
export const ELEMENT_NAME = Symbol('ELEMENT_NAME');
export const COMMENT_CONTAINER = Symbol('COMMENT_CONTAINER');

export const SCENE = 'scene' as const;
export const ELEMENT = 'element' as const;
export const CONTAINER = 'container' as const;

const defaultsElement = [
  [`${prefix}-container`, Container],
  [`${prefix}-sprite`, Sprite],
  [`${prefix}-tiling-sprite`, TilingSprite],
  [`${prefix}-text`, Text],
  [`${prefix}-graphics`, Graphics],
] as const;

export const CanvasElementStorage = new Map<
  string,
  Type<Container<ContainerChild> | PixiComponent>
>(defaultsElement);

export const CANVAS_ELEMENT_STORAGE = new InjectionToken<
  Map<string, Type<Container<ContainerChild> | PixiComponent>>
>('CANVAS_ELEMENT_STORAGE');

export const PIXI_APPLICATION_INIT = new InjectionToken<
  WritableSignal<boolean>
>('PIXI_APPLICATION_INIT');

export const PIXI_ELEMENT_PROPS_NAME = 'pixiElement';
export const PIXI_APP_PROPS_NAME = 'pixiApp';
export const PIXI_ON_INIT_PROPS_NAME = 'onPixiInit';
export const PIXI_ON_RENDER_PROPS_NAME = 'onRender';

export interface PixiComponentRender<C extends Container> {
  [PIXI_ELEMENT_PROPS_NAME]?: C;
  [PIXI_APP_PROPS_NAME]?: Application;
  [PIXI_ON_RENDER_PROPS_NAME]?: () => void;
}

export class PixiComponent<C extends Container = Container>
  implements PixiComponentRender<C>
{
  [PIXI_ELEMENT_PROPS_NAME]!: C;
  [PIXI_APP_PROPS_NAME]!: Application;
}

export class CommentContainer extends Container {
  public readonly [COMMENT_CONTAINER] = true;
}

export interface OnPixiInit {
  [PIXI_ON_INIT_PROPS_NAME]: () => void;
}

/**
 * Thrown when a template puts children inside an element that cannot hold any.
 *
 * PixiJS 8 draws through `ViewContainer`, which sets `allowChildren` to false:
 * `Graphics`, `Sprite`, `TilingSprite`, `Text`, `Mesh` and the rest of the drawing
 * classes are leaves. Only a plain `Container` may have children. pixi itself only
 * warns about it -- this library refuses, because a tree built that way is one pixi
 * has already announced it will stop supporting.
 */
export class PixiChildrenNotAllowedError extends Error {
  constructor(parent: Container, elementName?: string) {
    const tag = elementName ? `<${elementName}>` : 'This element';
    const type = parent.constructor.name;
    super(
      `${tag} is registered as ${type}, which cannot hold children in PixiJS 8. ` +
        `Only a plain Container may have children -- every drawing class extends ` +
        `ViewContainer, which sets allowChildren to false. Register it as a Container ` +
        `and put the ${type} inside it as a child element.`
    );
    this.name = 'PixiChildrenNotAllowedError';
  }
}
