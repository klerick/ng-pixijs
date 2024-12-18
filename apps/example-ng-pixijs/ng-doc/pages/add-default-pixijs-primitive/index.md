---
keyword: AddDefaultPixijsPrimitivePage
---

**NgPixiJS** - provides several components that allow working with PixiJs primitive in Angular way:


```typescript
import { Container, Sprite, TilingSprite, Text, Graphics } from 'pixi.js';

export interface HTMLElementTagNameMap {
  'pixi-container': Container;
  'pixi-sprite': Sprite;
  'pixi-tiling-sprite': TilingSprite;
  'pixi-text': Text;
  'pixi-graphics': Graphics;
}
```
The following primitives you can use in your stage components:

> **Warning**
> They shouldn't be **HTML** components!!!



```typescript group="create-scene" file="../../../src/app/example-doc/stage/stage.component.ts" name="stage.component.ts"

```

```html group="create-scene" file="../../../src/app/example-doc/stage/stage.component.html" name="stage.component.html"

```

{{ NgDocActions.demo("SceneComponent", {container: false}) }}

