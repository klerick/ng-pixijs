import { inject, InjectionToken } from '@angular/core';

import { DRAW_RECT } from './draw-rect';
import { Application, Graphics } from 'pixi.js';

export function textureBg() {
  const drawRect = inject(DRAW_RECT);
  const application = inject(Application);

  return () => {
    const rect = drawRect(new Graphics(), 0, 0, 9.5, 9.5)
      .fill({ color: 'white' })
      .stroke({ width: 0.5, color: 0xd9d9d9 });

    return application.renderer.generateTexture(rect);
  }

}

export const TEXTURE_BG = new InjectionToken<ReturnType<typeof textureBg>>(
  'TEXTURE_BG'
);
