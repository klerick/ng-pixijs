import { InjectionToken, signal } from '@angular/core';

export const SIZE = 10;
export const COUNT = 10;

export type SnakeItem = {
  id: string;
  positionX: number;
  positionY: number;
  direction: DirectionSnake;
  positionXRight?: number | undefined
  positionXLeft?: number | undefined
  positionYUp?: number | undefined
  positionYDown?: number | undefined
}

export type SnakeConfig = {
  count: number,
  positionX: number,
  positionY: number,
  speed: number,
  direction: DirectionSnake
  prevDirection: DirectionSnake | undefined,
  isRunning: boolean
  isWin: boolean | undefined,
  isStarted: boolean
}
export type DirectionSnake = 'right' | 'left' | 'up' | 'down'
export const configSnake = signal<SnakeConfig>({
  count: 0,
  positionX: 0,
  positionY: 100,
  speed: 0.5,
  direction: 'right',
  prevDirection: undefined,
  isRunning: false,
  isWin: undefined,
  isStarted: false
})


export const CONFIG_SNAKE = new InjectionToken('CONFIG_SNAKE', {
  providedIn: 'root',
  factory: () => configSnake
});
