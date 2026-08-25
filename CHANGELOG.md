# [1.5.0](https://github.com/klerick/ng-pixijs/compare/v1.4.0...v1.5.0) (2026-08-25)


* feat(ng-pixijs)!: refuse children on elements pixi treats as leaves ([ddd2588](https://github.com/klerick/ng-pixijs/commit/ddd258803aa8d0d44694be812ccea1e3c8c8b6bb))


### BREAKING CHANGES

* a template that puts children inside a drawing element now
throws PixiChildrenNotAllowedError instead of building the tree. Templates
relying on the old behaviour stop working and must nest the drawing object
inside a Container.

pixi 8 draws through ViewContainer, which sets allowChildren to false, so
Graphics, Sprite, TilingSprite, Text, Mesh and the rest are leaves; only a
plain Container may hold children. pixi itself only warns, once per child,
with a stack pointing at the consumer's template rather than at the cause.

The renderer could not see this because its guard is an instanceof and a
drawing class IS a Container by inheritance, so a Graphics parent passed the
check and went on to addChild. That assumption dates from pixi 6, where
Graphics held children legitimately. It now checks allowChildren in both
appendChild and insertBefore and reports the tag, the class it is registered
as, and what to do instead.

This is not only about @PixiContainer(false, Graphics): the default element
storage already maps pixi-graphics, pixi-sprite, pixi-text and
pixi-tiling-sprite to drawing classes, so <pixi-graphics> with anything
inside it was the same mistake with no decorator involved. The guard covers
both.

PixiStageDirective rethrows this one error rather than logging it. Its catch
exists to keep a transient failure from killing the stage, but swallowing
this one would leave a silently empty scene -- the exact failure this error
exists to remove. Every other error keeps the old behaviour.

Reproduced before the change and verified after: with a child inside
<pixi-graphics> the error now names the tag and no pixi deprecation warning
is emitted at all, since nothing reaches addChild.

The custom-component guide gains the rule, the failure and the correct shape
-- a Container with the drawing object inside it, reached through a template
reference variable, which resolves to the display object rather than a DOM
node. That last fact was load-bearing and written down nowhere.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>

# [1.4.0](https://github.com/klerick/ng-pixijs/compare/v1.3.3...v1.4.0) (2026-08-25)


### Features

* **ng-pixijs:** report application start and failure to the scene's owner ([2eb9738](https://github.com/klerick/ng-pixijs/commit/2eb9738358bec834d192bcd057f9195e27ba6335))

## [1.3.3](https://github.com/klerick/ng-pixijs/compare/v1.3.2...v1.3.3) (2026-08-25)


### Bug Fixes

* **ng-pixijs:** render once per frame and guard destroy before init ([a18fc7d](https://github.com/klerick/ng-pixijs/commit/a18fc7de92eed6835dfdc3178529c565cbe8d84c))

## [1.3.2](https://github.com/klerick/ng-pixijs/compare/v1.3.1...v1.3.2) (2026-08-21)


### Bug Fixes

* **ng-pixijs:** guard output detection against undefined properties ([3d8037e](https://github.com/klerick/ng-pixijs/commit/3d8037ec192e31c6a1db1622ee6eeda3d45d9430))

## [1.3.1](https://github.com/klerick/ng-pixijs/compare/v1.3.0...v1.3.1) (2026-02-25)


### Bug Fixes

* **ng-pixijs:** remove debug log from PixiStageDirective ([baa677f](https://github.com/klerick/ng-pixijs/commit/baa677f02ade328296ec64a96f528c835e0a5872))

# [1.3.0](https://github.com/klerick/ng-pixijs/compare/v1.2.0...v1.3.0) (2026-02-25)


### Features

* **ng-pixijs:** enhance output detection logic in PixiStageDirective with subscription support ([1428472](https://github.com/klerick/ng-pixijs/commit/14284725a671e56c7a49054588d5c2fdbca28057))

# [1.2.0](https://github.com/klerick/ng-pixijs/compare/v1.1.0...v1.2.0) (2026-02-24)


### Features

* **ng-pixijs:** add support for component input reflection in PixiStageDirective ([9ad315c](https://github.com/klerick/ng-pixijs/commit/9ad315cbec724f1a72a851fd933ffb53dade238b))

# [1.1.0](https://github.com/klerick/ng-pixijs/compare/v1.0.0...v1.1.0) (2026-02-24)


### Features

* **example-ng-pixijs:** bump to v21 angular ([d7c17f8](https://github.com/klerick/ng-pixijs/commit/d7c17f82da25a9795051cef65dda8482c7e577a1))
* **ng-pixijs:** bump to v21 angular ([03dbe70](https://github.com/klerick/ng-pixijs/commit/03dbe70e657bbe175d4a57cb79448319d2885d90))

# 1.0.0 (2024-12-19)


### Features

* **ng-pixijs:** first version ([d655168](https://github.com/klerick/ng-pixijs/commit/d65516845a34b644a0c6bad96c52aaf4a14a3d32))


### BREAKING CHANGES

* **ng-pixijs:** first version
