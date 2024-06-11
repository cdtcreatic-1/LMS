import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-buttons-next-back',
  templateUrl: './buttons-next-back.component.html',
  styleUrls: ['./buttons-next-back.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class ButtonsNextBackComponent implements OnInit {
  @Input() routerLinkBack: string;
  @Input() routerLinkNext: string;

  constructor() {}

  ngOnInit() {}
}
