import { Container, Graphics, Sprite, Text, TilingSprite } from 'pixi.js';

declare global {
  interface HTMLElementTagNameMap {
    'pixi-container': Container;
    'pixi-sprite': Sprite;
    'pixi-tiling-sprite': TilingSprite;
    'pixi-text': Text;
    'pixi-graphics': Graphics;
  }
}

// Needed to make this a module so TypeScript processes the `declare global`
export {};
