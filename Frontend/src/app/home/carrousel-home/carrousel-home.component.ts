import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carrousel-home',
  templateUrl: './carrousel-home.component.html',
  styleUrls: ['./carrousel-home.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class CarrouselHomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
