import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  setAccordionApprentice,
  setAccordionMyCourses,
  setChangeActualIdApprentice,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-button-profile-apprentice',
  templateUrl: './button-profile-apprentice.component.html',
  styleUrls: ['./button-profile-apprentice.component.css'],
  standalone: true,
})
export class ButtonProfileApprenticeComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  setAccordonFarmerProfile() {
    this.store.dispatch(setChangeActualIdApprentice({ value: 2 }));
    this.store.dispatch(setAccordionApprentice({}));
    this.store.dispatch(setAccordionMyCourses({ value: false }));
  }

  setProfile() {
    this.store.dispatch(setChangeActualIdApprentice({ value: 2 }));
    this.store.dispatch(setAccordionMyCourses({ value: false }));
    this.store.dispatch(setAccordionApprentice({ value: true }));
  }
}
