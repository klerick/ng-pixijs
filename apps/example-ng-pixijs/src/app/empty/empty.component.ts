import { Component } from '@angular/core';
import { NgDocButtonComponent, NgDocColor, NgDocNotifyService } from '@ng-doc/ui-kit';

@Component({
  selector: 'ng-empty',
  imports: [NgDocButtonComponent],
  templateUrl: './empty.component.html',
  standalone: true
})
export class EmptyComponent {
  color: NgDocColor = 'primary';

  constructor(private readonly notifyService: NgDocNotifyService) {}

  clickEvent(): void {
    this.notifyService.notify('Button was clicked!');
  }
}
