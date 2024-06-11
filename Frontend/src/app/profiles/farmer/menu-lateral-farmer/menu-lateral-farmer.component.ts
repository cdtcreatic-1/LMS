import { Component, Input, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import {
  selectDataCurrentWindow,
  selectDataUser,
} from 'src/app/store/selectors/global.selector';
import { Router } from '@angular/router';
import { clearCurrentWindow } from 'src/app/store/actions/current-window.actions';
import {
  clearStore,
  setChangeActualIdDasboard,
} from 'src/app/store/actions/user-menu.actions';
import { ButtonMenuComponent } from '../../../shared/button-menu/button-menu.component';
import { ButtonMenuCounterComponent } from '../../../shared/button-menu-counter/button-menu-counter.component';
import { NgClass, NgIf } from '@angular/common';
import { AccordionFarmerComponent } from 'src/app/profiles/farmer/menu-lateral-farmer/accordion-farmer/accordion-farmer.component';
import { ButtonProfileComponent } from 'src/app/profiles/shared/button-profile/button-profile.component';
import { MenuLateralService } from '../../service/menu-lateral.service';
import { clearShared } from 'src/app/store/actions/shared.actions';

@Component({
  selector: 'app-menu-lateral-farmer',
  templateUrl: './menu-lateral-farmer.component.html',
  styleUrls: ['./menu-lateral-farmer.component.css'],
  standalone: true,
  imports: [
    NgClass,
    ButtonProfileComponent,
    NgIf,
    AccordionFarmerComponent,
    ButtonMenuCounterComponent,
    ButtonMenuComponent,
  ],
})
export class MenuLateralFamerComponent implements OnInit {
  @Input() idSelected: number = 0;

  actualId: number;

  isAccordionObs$: Observable<boolean>;
  isAccordion: boolean = false;

  itemMenuLateral: number = 1;
  numberNotification: number = NaN;

  suscription = new Subscription();

  constructor(
    private mlateral: MenuLateralService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAccordionObs$ = this.mlateral.getisAccordion;
    this.isAccordionObs$.subscribe((index) => (this.isAccordion = index));

    this.suscription = this.store
      .select(selectDataCurrentWindow)
      .subscribe((data) => {
        this.actualId = data.actualCurrentWindow!;
      });

    this.store.select(selectDataUser).subscribe((data) => {
      this.itemMenuLateral = data.actualId;
      this.numberNotification = data.dataNotificationFarmer.length;
    });
  }
  handleClickButtons(actualId: number) {
    if (actualId === -1) {
      localStorage.clear();
      this.store.dispatch(clearCurrentWindow());
      this.store.dispatch(clearStore());
      this.store.dispatch(clearShared());
      this.router.navigate(['home']);
      return;
    }
    this.store.dispatch(setChangeActualIdDasboard({ actualId: actualId }));
  }

  logout() {
    console.log('logout');
  }
}
