import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/shared/constants';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  standalone: true,
  imports: [NgIf],
})
export class WelcomeComponent implements OnInit {
  @Input() pathRol: string;
  @Input() textCongratulations: string;
  @Input() textName: string;
  @Input() pathImage: string;
  @Input() textDownPhoto: string;
  @Input() idRole?: number;

  isReloading: boolean = true;

  constructor(private router: Router, private store: Store<AppState>) {}

  ngOnInit() {}

  finish() {
    if (this.idRole === 1) {
      this.router.navigate([ROUTES.USER_FARMER]);
    } else if (this.idRole === 2) {
      this.router.navigate([ROUTES.USER_BUSINESSMAN]);
    }
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
  }
}
