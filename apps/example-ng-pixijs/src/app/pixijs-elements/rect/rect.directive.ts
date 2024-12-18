import { Directive, input } from '@angular/core';
import { PixiComponent, PixiElement } from '@klerick/ng-pixijs';
import { Graphics } from 'pixi.js';


@PixiElement(Graphics)
@Directive({
  selector: 'pixi-rect',
  standalone: true,
})
export class PixiRectDirective extends PixiComponent<Graphics>{
  size = input.required<number>()
  x = input.required<number>()
  y = input.required<number>()
  color = input<string>(this.getRandomColor())

  onRender(){
    this.pixiElement.clear().rect(this.x(), this.y(), this.size(), this.size()).fill(this.color())
  }

  getRandomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    const color = (red << 16) | (green << 8) | blue;
    return '0x' + color.toString(16).padStart(6, '0');
  }
}
