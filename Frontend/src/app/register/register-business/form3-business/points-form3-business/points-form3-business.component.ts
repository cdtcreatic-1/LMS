import { Component, OnInit, Input } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

interface Pointer {
  id: number;
  isCheked: boolean;
}

@Component({
    selector: 'app-points-form3-business',
    templateUrl: './points-form3-business.component.html',
    styleUrls: ['./points-form3-business.component.css'],
    standalone: true,
    imports: [NgFor, NgClass],
})
export class PointsForm3BusinessComponent implements OnInit {
  @Input() position: number;

  pointers: Pointer[] = [
    { id: 1, isCheked: false },
    { id: 2, isCheked: false },
    { id: 3, isCheked: false },
    { id: 4, isCheked: false },
  ];

  ngOnInit(): void {
    const newArray: Pointer[] = [];
    this.pointers.forEach((item) => {
      if (item.id === this.position) {
        newArray.push({ ...item, isCheked: true });
      } else {
        newArray.push({ ...item, isCheked: false });
      }
    });
    this.pointers = newArray;
  }
}
