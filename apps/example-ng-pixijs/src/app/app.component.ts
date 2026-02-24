import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  NgDocNavbarComponent,
  NgDocRootComponent,
  NgDocSidebarComponent,
  NgDocThemeToggleComponent,
} from '@ng-doc/app';
import {
  NgDocButtonIconComponent,
  NgDocIconComponent,
  NgDocTooltipDirective,
} from '@ng-doc/ui-kit';
import { DatePipe, NgClass } from '@angular/common';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
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
    NgClass,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  location = inject(Location);
  router = inject(Router);
  title = 'NgPixiJS ';
  hideSidebar$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    map(() => this.isHideSidebar(this.router.url))
  );

  hideSidebar = toSignal(this.hideSidebar$, {
    initialValue: this.isHideSidebar(this.location.path()),
  });
  currentDate = new Date();

  isHideSidebar(path: string) {
    return !new URL(path, 'http://localhost').pathname.slice(1);
  }
}
