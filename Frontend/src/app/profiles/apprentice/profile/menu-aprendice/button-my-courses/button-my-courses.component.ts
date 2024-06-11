import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ROUTES } from 'src/app/shared/constants';
import {
  setAccordionApprentice,
  setAccordionMyCourses,
  setChangeActualIdApprentice,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-button-my-courses',
  templateUrl: './button-my-courses.component.html',
  styleUrls: ['./button-my-courses.component.css'],
  standalone: true,
  imports: [IonicModule],
})
export class ButtonMyCoursesComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  setAccordonFarmerProfile() {
    this.store.dispatch(setChangeActualIdApprentice({ value: 4 }));
    this.store.dispatch(setAccordionApprentice({ value: false }));
    this.store.dispatch(setAccordionMyCourses({}));

  }

  setProfile() {
    this.store.dispatch(setAccordionApprentice({ value: false }));
    this.store.dispatch(setAccordionMyCourses({ value: true }));
    this.store.dispatch(setChangeActualIdApprentice({ value: 4 }));
  }
}
