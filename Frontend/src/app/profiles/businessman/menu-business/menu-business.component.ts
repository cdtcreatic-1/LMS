import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import {
  selectBusinessProfile,
  selectDataUser,
} from 'src/app/store/selectors/global.selector';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  clearStore,
  setChangeActualIdDasboard,
} from 'src/app/store/actions/user-menu.actions';
import { clearCurrentWindow } from 'src/app/store/actions/current-window.actions';
import { ButtonMenuComponent } from '../../../shared/button-menu/button-menu.component';
import { ButtonMenuCounterComponent } from '../../../shared/button-menu-counter/button-menu-counter.component';
import { NgClass, NgIf } from '@angular/common';
import { ButtonProfileComponent } from 'src/app/profiles/shared/button-profile/button-profile.component';
import { AccordionBusinessmanComponent } from 'src/app/profiles/businessman/menu-business/accordion-businessman/accordion-businessman.component';
import { MenuLateralService } from '../../service/menu-lateral.service';
import { clearShared } from 'src/app/store/actions/shared.actions';
import {  MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-menu-business',
  templateUrl: './menu-business.component.html',
  styleUrls: ['./menu-business.component.css'],
  standalone: true,
  imports: [
    NgClass,
    ButtonProfileComponent,
    NgIf,
    AccordionBusinessmanComponent,
    ButtonMenuCounterComponent,
    ButtonMenuComponent,
    MatDialogModule,
  ],
})
export class MenuBusinessComponent implements OnInit {
  @Input() idSelected: number = 0;

  isAccordionObs$: Observable<boolean>;
  isAccordion: boolean = false;

  itemMenuLateral: number = NaN;

  numberProductsCar: number = NaN;
  numberNotification: number = NaN;

  constructor(
    private mlateral: MenuLateralService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAccordionObs$ = this.mlateral.getisAccordion;
    this.isAccordionObs$.subscribe((index) => (this.isAccordion = index));

    this.store.select(selectDataUser).subscribe((data) => {
      this.itemMenuLateral = data.actualId;
    });

    this.store.select(selectBusinessProfile).subscribe((data) => {
      this.numberProductsCar = data.dataCarShop.length;
      this.numberNotification = data.dataNotification.length;
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
}
