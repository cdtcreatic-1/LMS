import { Component, Input } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-global-buttons',
  templateUrl: './global-buttons.component.html',
  styleUrls: ['./global-buttons.component.css'],
  standalone: true,
  imports: [NgStyle, NgIf, RouterLink],
})
export class GlobalButtonsComponent {
  @Input() nameButton: string;
  @Input() color?: string;
  @Input() backgroud?: string;
  @Input() borderColor?: string;
  @Input() height?: string;
  @Input() width?: string;
  @Input() callbackFunction: (arg: any) => void;

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private store: Store<AppState>
  ) {}
}
