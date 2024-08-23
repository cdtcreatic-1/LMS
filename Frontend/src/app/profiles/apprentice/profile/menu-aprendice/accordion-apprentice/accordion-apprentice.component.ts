import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  setAccordionApprentice,
  setChangeActualIdApprentice,
  setModalUpdateProfile,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/shared/constants';
import { AddProfileComponent } from 'src/app/profiles/shared/add-profile/add-profile.component';

@Component({
  selector: 'app-accordion-apprentice',
  templateUrl: './accordion-apprentice.component.html',
  styleUrls: ['./accordion-apprentice.component.css'],
  standalone: true,
  imports: [NgClass, MatDialogModule],
})
export class AccordionApprenticeComponent implements OnInit, OnDestroy {
  actualId: number;

  suscription: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private matdialog: MatDialog,
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
      case 0:
        this.matdialog.open(AddProfileComponent);
        break;
      case 1:
        this.store.dispatch(setChangeActualIdApprentice({ value: 2 }));
        break;
      case 2:
        this.store.dispatch(setChangeActualIdApprentice({ value: 3 }));
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
