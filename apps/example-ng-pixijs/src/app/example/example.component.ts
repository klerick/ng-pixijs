import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  NO_ERRORS_SCHEMA,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixiSceneComponent, PixiStageDirective } from '@klerick/ng-pixijs';
import { ApplicationOptions } from 'pixi.js';
import { pixiJsProviders } from '../utils/providers';
import { PixiBgStageComponent } from '../pixijs-elements/bg-stage/bg-stage.component';
import { SnakeStageComponent } from '../pixijs-elements/snake-stage/snake-stage.component';
import { CONFIG_SNAKE, COUNT, DirectionSnake } from '../utils/providers/config-snake';
import { NgDocButtonComponent } from '@ng-doc/ui-kit';

@Component({
  selector: 'app-example',
  imports: [
    CommonModule,
    PixiSceneComponent,
    PixiStageDirective,
    PixiBgStageComponent,
    SnakeStageComponent,
    NgDocButtonComponent,
  ],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    ngSkipHydration: 'true',
  },
  schemas: [NO_ERRORS_SCHEMA],
  providers: [...pixiJsProviders],
})
export class ExampleComponent {
  config = inject(CONFIG_SNAKE);

  pixiJsConfig = signal<Partial<ApplicationOptions>>({
    backgroundColor: 'grey',
    width: 500,
    height: 500,
  });

  speed = computed(() => parseFloat(this.config().speed.toFixed(1)));

  @HostListener('document:keyup', ['$event'])
  mouseover(event: KeyboardEvent) {
    const directionKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    if (directionKey.includes(event.key)) {
      let direction: DirectionSnake | null = null;
      switch (event.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
      }

      if (this.config().direction === 'right' && direction === 'left') return;
      if (this.config().direction === 'left' && direction === 'right') return;
      if (this.config().direction === 'down' && direction === 'up') return;
      if (this.config().direction === 'up' && direction === 'down') return;

      if (!direction || direction === this.config().direction) return;

      this.config.update((r) => ({
        ...r,
        direction,
        prevDirection: r.direction,
      }));
    }
  }

  startGame() {
    this.config.update((r) => {
      return {
        ...r,
        isRunning: true,
        isStarted: true,
        count: COUNT,
      };
    });
  }

  resetGame() {
    this.config.update((r) => {
      return {
        isRunning: false,
        prevDirection: 'right',
        direction: 'right',
        isStarted: false,
        count: 0,
        speed: 0.5,
        positionX: 0,
        positionY: 0,
        isWin: undefined,
      };
    });
  }

  stopGame() {
    this.config.update((r) => ({
      ...r,
      isRunning: false,
    }));
  }
}
