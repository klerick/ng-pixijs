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
<pixi-scene ngSkipHydration [pixiJsConfig]="pixiJsConfig()"/>
```
