---
keyword: CreateStageComponentPage
---

To add a stage in PixiJS within your Angular application, you will need to work with the stage property of the [Application](https://pixijs.download/release/docs/app.Application.html#stage) class. 
A PixiJS stage is essentially a container that holds all display objects (sprites, graphics, etc.) that you want to render. 
In this setup, you can have multiple stages, each represented by an Angular component.

> **Note**
> Ensure to add [**CUSTOM_ELEMENTS_SCHEMA**](https://angular.dev/guide/components/advanced-configuration#custom-element-schemas) to the component's schemas.

The stage property of the Application class can be used to manage multiple stages. 
Each Angular component can represent a separate stage, allowing you to modularize and organize your PixiJS application effectively.

Create an Angular component to represent your PixiJS stage. 
Use the **`PixiContainer`** decorator and extend **`PixiComponent<Container>`** to integrate with PixiJS.

```typescript file="../../../src/app/example-doc/stage/stage.component.ts" name="stage.component.ts" icon="angular"

```

Then add stage component to scene component and import 

```typescript group="create-scene" name="scene.component.ts" {6,11,12}
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixiSceneComponent, PixiStageDirective } from '@klerick/ng-pixijs';
import { ApplicationOptions } from 'pixi.js';

import {StageComponent} from './stage.component'

@Component({
  selector: 'app-scene',
  imports: [
    PixiSceneComponent,
    PixiStageDirective,
    StageComponent,
  ],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SceneComponent {
  pixiJsConfig = signal<Partial<ApplicationOptions>>({
    backgroundColor: 'grey',
    width: 500,
    height: 500,
  });
}
```

```html group="create-scene" name="scene.component.html"
<pixi-scene ngSkipHydration [pixiJsConfig]="pixiJsConfig()">
  <!-- Add component to template -->
  <app-stage stage/>
</pixi-scene>
```

By following these steps, you can leverage the power of PixiJS stages within your Angular application, using Angular components to create and manage multiple stages.
This approach provides a structured way to integrate PixiJS's rendering capabilities with Angular's component-based architecture.

