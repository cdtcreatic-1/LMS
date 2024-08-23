import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-global-titles',
    templateUrl: './global-titles.component.html',
    styleUrls: ['./global-titles.component.css'],
    standalone: true,
})
export class GlobalTitlesComponent {
  @Input() titleName: string;
}
