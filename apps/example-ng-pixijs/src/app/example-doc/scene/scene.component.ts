import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixiSceneComponent, PixiStageDirective } from '@klerick/ng-pixijs';
import { ApplicationOptions } from 'pixi.js';
import { StageComponent } from '../stage/stage.component';

@Component({
  selector: 'app-scene',
  imports: [
    CommonModule,
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
    height: 500,
  });
}
