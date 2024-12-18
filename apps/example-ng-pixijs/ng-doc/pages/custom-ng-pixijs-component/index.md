---
keyword: CreateCustomNgPixiJSComponentPage
---

You can add additional [container](https://pixijs.download/release/docs/scene.Container.html) component and use it inside of stage or other container component.
You can add your own providers. The template can be empty or contain other **NgPixiJS** component
```typescript group="additional-contayner" name="app-some-contayner.component.ts"
import { PixiContainer } from '@klerick/ng-pixijs';
import { Container } from 'pixi.js';

@PixiContainer()
@Component({
  selector: 'app-some-contayner',
  imports: [],
  templateUrl: './app-some-contayner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppSomeContaynerComponent extends PixiComponent<Container> {
}
```

You can create your own primitive with the custom logic and use PixiJs primitive as basis. This type of component must not contain a template. 
So, because of this you need to use a [@Directive](https://angular.dev/api/core/Directive)


```typescript group="additional-contayner" name="app-some-contayner.component.ts"

import { PixiElement } from '@klerick/ng-pixijs';
import { Graphics } from 'pixi.js';

@PixiElement(Graphics)
@Directive({
  selector: 'app-some-rect',
  standalone: true,
})
export class AppSomeRectDirective extends PixiComponent<Graphics>{
}
```

`PixiComponent<T extend Container>` - has several additional lifecycle hooks and properties.

**onPixiInit** - This callback is used after initialization of PixiJS application. You should implement interface `OnPixiInit`
**onRender** - This callback is used when the container is [rendered](https://pixijs.download/release/docs/scene.Container.html#onRender).

**pixiApp** - This property contains the instance of [Application](https://pixijs.download/release/docs/app.Application.html)
**pixiElement** - This property contains the instance of base class
