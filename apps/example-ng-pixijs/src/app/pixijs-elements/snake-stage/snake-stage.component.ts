import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnPixiInit, PixiComponent, PixiContainer } from '@klerick/ng-pixijs';
import { Container } from 'pixi.js';
import { v7 as uuid } from 'uuid';
import { PixiRectDirective } from '../rect/rect.directive';
import {
  CONFIG_SNAKE,
  SIZE,
  SnakeItem,
} from '../../utils/providers/config-snake';
import { pixiJsProviders } from '../../utils/providers';

import {
  checkIsSnakeInsideFood,
  checkIsSnakeInsideWall,
  getRandomSquareCoordinates,
  moveFirst,
  setPositionFromPrev,
  checkSelfCollision,
} from '../../utils/helpers';

@PixiContainer(true)
@Component({
  selector: 'pixi-snake-stage',
  imports: [CommonModule, PixiRectDirective],
  templateUrl: './snake-stage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: pixiJsProviders,
})
export class SnakeStageComponent
  extends PixiComponent<Container>
  implements OnPixiInit
{
  private readonly snakeConfig = inject(CONFIG_SNAKE);

  size = SIZE;
  food = signal({
    x: 0,
    y: 0,
  });

  private defaultSnakeArray() {
    return Array(this.snakeConfig().count)
      .fill(null)
      .map((i, index) => {
        return {
          positionX: this.snakeConfig().positionX - index * this.size,
          positionY: this.snakeConfig().positionY,
          id: uuid(),
          direction: this.snakeConfig().direction,
        };
      });
  }

  sizeSnake = signal<SnakeItem[]>([]);

  onPixiInit(): void {
    this.food.set(
      getRandomSquareCoordinates(
        this.pixiApp.screen.width / this.size,
        this.size
      )
    );
  }

  onRender() {
    let runCdf = false;
    const snakeConfig = this.snakeConfig();
    const sizeSnake = this.sizeSnake();

    if (snakeConfig.count === 0) {
      this.sizeSnake.set([]);
      return;
    }
    if (snakeConfig.count !== sizeSnake.length) {
      this.sizeSnake.set(this.defaultSnakeArray());
      return;
    }
    if (!snakeConfig.isRunning) return;

    const newSizeSnake: SnakeItem[] = [];
    if (
      checkIsSnakeInsideFood(
        { x: snakeConfig.positionX, y: snakeConfig.positionY },
        this.food(),
        this.size
      )
    ) {
      const snakeItem = sizeSnake.at(-1);
      if (!snakeItem) throw new Error('firstItem not found');
      sizeSnake.push({
        ...snakeItem,
        positionX: snakeItem.positionX | 0,
        positionY: snakeItem.positionY | 0,
        id: uuid(),
      });
      this.food.set(
        getRandomSquareCoordinates(
          this.pixiApp.screen.width / this.size,
          this.size
        )
      );
      snakeConfig.count = snakeConfig.count + 1;
      snakeConfig.speed = snakeConfig.speed + 0.1;
      runCdf = true;
    }
    if (
      checkIsSnakeInsideWall(
        {
          x: snakeConfig.positionX,
          y: snakeConfig.positionY,
        },
        this.pixiApp.screen.width,
        this.pixiApp.screen.height
      )
    ) {
      snakeConfig.isWin = false;
      snakeConfig.isRunning = false;
      runCdf = true;
    }

    if (checkSelfCollision(sizeSnake, this.size)) {
      snakeConfig.isWin = false;
      snakeConfig.isRunning = false;
      runCdf = true;
    }

    if (runCdf) {
      this.sizeSnake.set([...sizeSnake]);
      this.snakeConfig.set(snakeConfig);
    }
    const firstItem = moveFirst({ ...sizeSnake[0] }, snakeConfig, this.size);
    newSizeSnake.push(firstItem);

    for (let i = 1; i < sizeSnake.length; i++) {
      const { positionX, positionY, direction } = setPositionFromPrev(
        sizeSnake[i].direction,
        sizeSnake[i].positionX,
        sizeSnake[i].positionY,
        newSizeSnake[i - 1].positionX,
        newSizeSnake[i - 1].positionY,
        this.size,
        snakeConfig.speed
      );

      newSizeSnake.push({
        ...sizeSnake[i],
        positionX,
        positionY,
        direction,
      });
    }

    this.sizeSnake.set(newSizeSnake);
    this.snakeConfig.set({
      ...snakeConfig,
      positionX: firstItem.positionX,
      positionY: firstItem.positionY,
    });
  }
}
