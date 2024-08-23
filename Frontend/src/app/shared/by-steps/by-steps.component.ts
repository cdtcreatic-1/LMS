import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-by-steps',
  templateUrl: './by-steps.component.html',
  styleUrls: ['./by-steps.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, NgStyle],
})
export class ByStepsComponent implements OnInit {
  @Input() numberByStep: number;
  @Input() actualId: number;
  @Input() showNumber: boolean;

  dataByStep: number[];

  ngOnInit(): void {
    this.dataByStep = new Array(this.numberByStep);
  }
}
