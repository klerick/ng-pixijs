import { DRAW_RECT, drawRect } from './draw-rect';
import { TEXTURE_BG, textureBg } from './texture-bg';

export {
  DRAW_RECT,
  TEXTURE_BG
}

export const pixiJsProviders = [
  {
    provide: DRAW_RECT,
    useFactory: drawRect,
  },
  {
    provide: TEXTURE_BG,
    useFactory: textureBg,
  },
]
