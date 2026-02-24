import { Component, inject } from '@angular/core';
import {
  NgDocButtonComponent,
  NgDocColor,
  NgDocNotifyService,
} from '@ng-doc/ui-kit';

@Component({
  selector: 'app-empty',
  imports: [NgDocButtonComponent],
  templateUrl: './empty.component.html',
  standalone: true,
})
export class EmptyComponent {
  color: NgDocColor = 'primary';

  private readonly notifyService = inject(NgDocNotifyService);

  clickEvent(): void {
    this.notifyService.notify('Button was clicked!');
  }
}
