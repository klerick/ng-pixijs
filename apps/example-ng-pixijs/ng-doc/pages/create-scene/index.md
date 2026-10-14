---
title: Creating a Scene with PixiJS in Angular
keyword: CreateScenePage
---

To create a scene using PixiJS within your Angular application, you can utilize the `PixiSceneComponent` provided by the library. This component allows you to seamlessly integrate PixiJS's rendering capabilities into your Angular components.

Import the `PixiSceneComponent` into the Angular component where you want to create your PixiJS scene.

> **Note**
> When using Angular's server-side rendering (SSR), it's important to add [ngSkipHydration](https://angular.dev/guide/hydration#how-to-skip-hydration-for-particular-components) to prevent server-side rendering for the components that require direct access to browser APIs, like those using PixiJS.

```typescript group="create-scene" file="../../../src/app/example-doc/scene/scene.component.ts" name="scene.component.ts"

```

```html group="create-scene" name="scene.component.html"
<pixi-scene ngSkipHydration [pixiJsConfig]="pixiJsConfig()" />
```

## Size

The scene draws into a canvas the size of its host element. pixi measures that host when the
application starts and again whenever the **window** resizes — nothing else. A host that changes
size on its own, because its content got wider or a sidebar collapsed next to it, keeps the old
canvas: nothing is drawn past its edge.

Set `followHost` when the host can change size like that:

```html
<pixi-scene ngSkipHydration followHost [pixiJsConfig]="pixiJsConfig()" />
```

The scene then observes its host and resizes the canvas with it. It also makes the host
`display: block`: `<pixi-scene>` is an inline element by default, and an inline box measures 0×0,
so pixi would fall back to the `width` and `height` from `pixiJsConfig`. Give the host a height of
its own — a block with no height is as tall as the canvas inside it, so it can grow wider and
narrower but never shorter.

Without `followHost` nothing changes: the host stays inline, and a scene sized through
`pixiJsConfig` keeps that size.

## Knowing whether the application started

A canvas needs a working WebGL or 2d context, and there are places with neither — hardware
acceleration turned off, older machines, jsdom in unit tests. The scene reports the outcome
outwards, so the surrounding component can react instead of leaving a dead canvas on screen.

Both outputs answer one question only — did the application come up. What the scene _contains_
stays the business of the stage and its own components, which have `onPixiInit` for that.

```html group="scene-outputs" name="scene.component.html"
<pixi-scene ngSkipHydration [pixiJsConfig]="pixiJsConfig()" (pixiInit)="onReady($event)" (initError)="onFailed($event)" />

@if (failed()) {
<p>The diagram cannot be drawn in this browser.</p>
}
```

`pixiInit` hands over the `Application` itself, so anything that belongs to whoever owns the
scene — pausing and resuming it, for instance — can live there rather than being
smuggled into a stage:

```typescript group="scene-outputs" name="scene.component.ts"
protected readonly failed = signal(false);
private app?: Application;

protected onReady(app: Application): void {
  this.app = app;
}

protected pause(): void {
  this.app?.stop();
}

protected resume(): void {
  this.app?.start();
}

protected onFailed(error: unknown): void {
  this.failed.set(true);
  console.warn('scene unavailable', error);
}
```

> **Note**
> When `init()` fails, `pixiInit` never fires and `onPixiInit` hooks on the stage and its
> components do not run, so nothing executes against an application that was never built.
