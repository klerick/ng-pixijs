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
scene — following the size of the host box, for instance — can live there rather than being
smuggled into a stage:

```typescript group="scene-outputs" name="scene.component.ts"
protected readonly failed = signal(false);

protected onReady(app: Application): void {
  const box = app.canvas.parentElement;
  if (!box) return;

  const observer = new ResizeObserver(() => app.queueResize());
  observer.observe(box);
  inject(DestroyRef).onDestroy(() => observer.disconnect());
}

protected onFailed(error: unknown): void {
  this.failed.set(true);
  console.warn('scene unavailable', error);
}
```

> **Note**
> When `init()` fails, `pixiInit` never fires and `onPixiInit` hooks on the stage and its
> components do not run, so nothing executes against an application that was never built.
