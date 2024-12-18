import { ChangeDetectionStrategy, Component, inject, input, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgDocButtonComponent, NgDocTextComponent } from '@ng-doc/ui-kit';
import { RouterLink } from '@angular/router';
import { ExampleComponent } from '../example/example.component';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    NgDocTextComponent,
    NgDocButtonComponent,
    RouterLink,
    ExampleComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MainComponent {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID))

}
