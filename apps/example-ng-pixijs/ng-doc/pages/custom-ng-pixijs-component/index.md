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
export class AppSomeContaynerComponent extends PixiComponent<Container> {}
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
export class AppSomeRectDirective extends PixiComponent<Graphics> {}
```

`PixiComponent<T extend Container>` - has several additional lifecycle hooks and properties.

**onPixiInit** - This callback is used after initialization of PixiJS application. You should implement interface `OnPixiInit`
**onRender** - This callback is used when the container is [rendered](https://pixijs.download/release/docs/scene.Container.html#onRender).

**pixiApp** - This property contains the instance of [Application](https://pixijs.download/release/docs/app.Application.html)
**pixiElement** - This property contains the instance of base class

## Only a container may have children

PixiJS 8 draws through `ViewContainer`, and it sets `allowChildren` to `false`. Every drawing
class inherits from it — `Graphics`, `Sprite`, `TilingSprite`, `Text`, `Mesh`, `NineSliceSprite`
and the rest — so **each of them is a leaf**. Only a plain `Container` may hold children.

That makes the tempting shape the wrong one. Registering a component against a drawing class
gives you one display object instead of two, but a component has a template, and a template
means children:

```typescript
@PixiContainer(false, Graphics) // ← do not
@Component({
  selector: 'app-card',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<pixi-text>Card title</pixi-text>`,
})
export class Card extends PixiComponent<Graphics> {}
```

The library refuses this and throws `PixiChildrenNotAllowedError`, naming the tag and the fix.
The same applies to the built-in primitives — `<pixi-graphics>` with anything inside it is the
same mistake, decorator or not.

Put the drawing object inside a container instead, and reach it with a template reference
variable. **A reference on a pixi tag resolves to the display object, not to a DOM node**, so
annotate it accordingly:

```typescript
@PixiContainer()
@Component({
  selector: 'app-card',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <pixi-graphics #chrome />
    <pixi-text [x]="8" [y]="8">Card title</pixi-text>
  `,
})
export class Card extends PixiComponent<Container> {
  private readonly chrome = viewChild<ElementRef<Graphics>>('chrome');

  constructor() {
    super();
    effect(() => {
      const chrome = this.chrome()?.nativeElement;
      chrome?.clear().roundRect(0, 0, 200, 80, 8).fill('#1e293b');
    });
  }
}
```

Directives registered with `@PixiElement` are unaffected: a directive has no template, so it is
a leaf already, which is why `@PixiElement(Graphics)` is the right way to wrap a drawing class
with custom logic.
