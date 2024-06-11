import { Component, Input } from '@angular/core';
import { NgStyle, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.css'],
  standalone: true,
  imports: [NgStyle, NgIf],
})
export class ButtonMenuComponent {
  @Input() buttonName: string;
  @Input() idItemMenu: number;
  @Input() iconItemPath?: string;
  @Input() isSelected?: boolean;
  @Input() onClick: (number: number) => void;

  constructor(private router: Router, private store: Store<AppState>) {}
}
