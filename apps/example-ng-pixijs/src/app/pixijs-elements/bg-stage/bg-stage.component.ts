import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

import { PixiComponent, PixiContainer } from '@klerick/ng-pixijs';
import { Container } from 'pixi.js';

import { pixiJsProviders } from '../../utils/providers';
import { PixiMainBgDirective } from '../main-bg/main-bg.directive';

@PixiContainer(true)
@Component({
  selector: 'app-bg-stage',
  imports: [PixiMainBgDirective],
  templateUrl: './bg-stage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: pixiJsProviders,
})
export class PixiBgStageComponent extends PixiComponent<Container> {}
