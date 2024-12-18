import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { injectAutoEffect, PixiComponent, PixiContainer } from '@klerick/ng-pixijs';
import { Application, Container, Graphics, Texture} from 'pixi.js';

@PixiContainer(true)
@Component({
  selector: 'app-stage',
  imports: [],
  templateUrl: './stage.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StageComponent extends PixiComponent<Container>{
  private readonly application = inject(Application);
  private readonly autoEffect = injectAutoEffect();
  protected texture!: Texture
  protected textureWidth!: number
  protected textureHeight!: number
  protected show = false
  protected rectXPosition = signal(20)
  private direction: 'right' | 'left' = 'right'


  protected readonly rectForTexture = new Graphics()
    .rect(0, 0, 9.5, 9.5).fill({ color: 'white' })
    .stroke({ width: 0.5, color: 0xd9d9d9 });

  onPixiInit(): void {
    this.textureWidth = this.application.screen.width;
    this.textureHeight = this.application.screen.height;
    this.autoEffect(() => {
      this.texture = this.application.renderer.generateTexture(this.rectForTexture)
    })
    this.show = true

  }

  onRender(){
    let rectXPosition = this.rectXPosition()
    if (this.direction === 'right') {
      rectXPosition += 0.5;

      if (rectXPosition > 100) {
       this.direction = 'left'
      }
    }

    if (this.direction === 'left') {
      rectXPosition -= 0.5;

      if (rectXPosition < 20) {
        this.direction = 'right'
      }
    }

   this.rectXPosition.set(
      rectXPosition
    )
  }
}


