import { Component, Input } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

@Component({
    selector: 'app-indicator',
    templateUrl: './indicator.component.html',
    styleUrls: ['./indicator.component.css'],
    standalone: true,
    imports: [NgFor, NgClass],
})
export class IndicatorComponent {
  @Input() indexIndicator: number;

  constructor() {}

  data: number[] = [11, 12, 13, 14];
}
