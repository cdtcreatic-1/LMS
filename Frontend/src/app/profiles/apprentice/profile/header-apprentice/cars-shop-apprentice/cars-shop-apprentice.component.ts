import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-cars-shop-apprentice',
    templateUrl: './cars-shop-apprentice.component.html',
    styleUrls: ['./cars-shop-apprentice.component.css'],
    standalone: true,
    imports: [NgIf],
})
export class CarsShopApprenticeComponent {
  @Input() actualId: number;
}
