import { Graphics, GraphicsContext } from 'pixi.js';
import { InjectionToken } from '@angular/core';


function rectContextFactory(
  x: number,
  y: number,
  width: number,
  height: number,
  radius:
    | number
    | [
    rtRadius: number,
    rbRadius: number,
    lbRadius: number,
    ltRadius: number
  ] = 0,
  context: GraphicsContext = new GraphicsContext()
): GraphicsContext {
  const [rtRadius, rbRadius, lbRadius, ltRadius] = Array.isArray(radius)
    ? radius
    : [radius, radius, radius, radius];

  return context
    .clear()
    .moveTo(x + rtRadius, y)
    .lineTo(x + width - rtRadius, y)
    .arcTo(x + width, y, x + width, y + rtRadius, rtRadius)
    .lineTo(x + width, y + height - rbRadius)
    .arcTo(x + width, y + height, x, y + height, rbRadius)
    .lineTo(x + rbRadius, y + height)
    .arcTo(x, y + height, x, y + height - lbRadius, lbRadius)
    .lineTo(x, y + ltRadius)
    .arcTo(x, y, x + ltRadius, y, ltRadius);
};

export function drawRect() {
  return function drawRectFactory<T extends Graphics>(
    element: T,
    x: number,
    y: number,
    width: number,
    height: number,
    radius:
      | number
      | [
      rtRadius: number,
      rbRadius: number,
      lbRadius: number,
      ltRadius: number
    ] = 0
  ): T {
    element.context = rectContextFactory(x, y, width, height, radius);
    return element;
  };
}

export const DRAW_RECT = new InjectionToken<ReturnType<typeof drawRect>>(
  'DRAW_RECT'
);
