import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { NgClass } from '@angular/common';
import { MenuLateralService } from 'src/app/profiles/service/menu-lateral.service';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddProfileComponent } from 'src/app/profiles/shared/add-profile/add-profile.component';

@Component({
  selector: 'app-accordion-farmer',
  templateUrl: './accordion-farmer.component.html',
  styleUrls: ['./accordion-farmer.component.css'],
  standalone: true,
  imports: [NgClass, MatDialogModule],
})
export class AccordionFarmerComponent implements OnInit, OnDestroy {
  isAccordionObs$: Observable<boolean>;
  isAccordion: boolean;

  actualId: number = NaN;

  suscription: Subscription[] = [];

  constructor(
    private mlateral: MenuLateralService,
    private store: Store<AppState>,
    private matdialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAccordionObs$ = this.mlateral.getisAccordion;
    const suscription1 = this.isAccordionObs$.subscribe(
      (index) => (this.isAccordion = index)
    );

    const suscription2 = this.store.select(selectDataUser).subscribe((data) => {
      this.actualId = data.actualId;
    });

    this.suscription.push(suscription1);
    this.suscription.push(suscription2);
  }

  setBodyFarmer(id: number) {
    this.mlateral.setItemMenuLateral(1);
    switch (id) {
      case 0:
        this.matdialog.open(AddProfileComponent);
        break;
      case 1:
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
        break;
      case 2:
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 3 }));
        break;
      case 3:
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 4 }));
        break;
      case 4:
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 5 }));
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
