import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  NgDocNavbarComponent,
  NgDocRootComponent,
  NgDocSidebarComponent,
  NgDocThemeToggleComponent
} from '@ng-doc/app';
import {
  NgDocButtonIconComponent,
  NgDocIconComponent,
  NgDocTooltipDirective,
  preventInitialChildAnimations
} from '@ng-doc/ui-kit';
import { DatePipe } from '@angular/common';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  animations: [preventInitialChildAnimations],
  imports: [
    RouterModule,
    NgDocNavbarComponent,
    NgDocRootComponent,
    NgDocSidebarComponent,
    NgDocThemeToggleComponent,
    NgDocIconComponent,
    DatePipe,
    NgDocButtonIconComponent,
    NgDocTooltipDirective,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  router = inject(Router);
  title = 'NgPixiJS ';
  hideSidebar$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    map(() => this.router.url.split('/').filter((i) => !!i).length === 0)
  );

  hideSidebar = toSignal(this.hideSidebar$, { initialValue: true });
  currentDate = new Date();
}
