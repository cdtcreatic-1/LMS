import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-buttons',
    templateUrl: './buttons.component.html',
    styleUrls: ['./buttons.component.css'],
    standalone: true,
    imports: [NgIf],
})
export class ButtonsComponent {
  @Input() nameButton: string = '';
  @Input() iconUrl: string = '';
  @Input() sizeWidth: number = 0;

  constructor() {}
}
