import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  setAccordionApprentice,
  setChangeActualIdApprentice,
  setModalUpdateProfile,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { MatDialog } from '@angular/material/dialog';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { ROUTES } from 'src/app/shared/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accordion-my-courses',
  templateUrl: './accordion-my-courses.component.html',
  styleUrls: ['./accordion-my-courses.component.css'],
  standalone: true,
  imports: [NgClass],
})
export class AccordionMyCoursesComponent implements OnInit, OnDestroy {
  actualId: number;

  suscription: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private matDialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const suscruption1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.actualId = data.actualId;
      });

    this.suscription.add(suscruption1);
  }

  setBodyFarmer(id: number) {
    switch (id) {
      case 1:
        this.store.dispatch(setChangeActualIdApprentice({ value: 4 }));
        break;
      case 2:
        this.store.dispatch(setChangeActualIdApprentice({ value: 5 }));
        break;
      case 3:
        this.store.dispatch(setChangeActualIdApprentice({ value: 6 }));
        break;
      default:
        break;
    }
    this.router.navigate([ROUTES.USER_APPRENTICE]);
    // this.store.dispatch(setAccordionApprentice({ value: false }));
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
