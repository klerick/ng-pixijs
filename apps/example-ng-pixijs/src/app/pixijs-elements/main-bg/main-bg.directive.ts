import { Directive, inject } from '@angular/core';
import { injectAutoEffect, OnPixiInit, PixiComponent, PixiElement } from '@klerick/ng-pixijs';
import { TilingSprite } from 'pixi.js';
import { TEXTURE_BG } from '../../utils/providers';

@PixiElement(TilingSprite)
@Directive({
  selector: 'pixi-main-bg',
  standalone: true,
})
export class PixiMainBgDirective extends PixiComponent<TilingSprite> implements OnPixiInit{
  private readonly autoEffect = injectAutoEffect();
  textureBg = inject(TEXTURE_BG)()

  onPixiInit(): void {

    this.pixiElement.width = this.pixiApp.screen.width;
    this.pixiElement.height = this.pixiApp.screen.height;

    this.pixiElement.x = 0;
    this.pixiElement.y = 0;

    this.autoEffect(() => {
      this.pixiElement.texture = this.textureBg;
    });
  }
}
