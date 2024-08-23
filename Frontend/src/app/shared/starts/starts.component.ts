import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgStyle, NgIf } from '@angular/common';

@Component({
    selector: 'app-starts',
    templateUrl: './starts.component.html',
    styleUrls: ['./starts.component.css'],
    standalone: true,
    imports: [
        NgFor,
        NgStyle,
        NgIf,
    ],
})
export class StartsComponent implements OnInit {
  @Input() numberStart: number;
  @Input() background?: boolean = false;
  @Input() height?: string;
  @Input() width?: string;

  dataStart: number[];

  ngOnInit() {
    this.dataStart = new Array(this.numberStart);
  }
}
