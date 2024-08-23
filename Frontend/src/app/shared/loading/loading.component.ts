import { Component, OnInit, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css'],
    standalone: true,
    imports: [NgIf],
})
export class LoadingComponent implements OnInit {
  @Input() isLoading: boolean = false;

  constructor() {}

  ngOnInit() {}
}
