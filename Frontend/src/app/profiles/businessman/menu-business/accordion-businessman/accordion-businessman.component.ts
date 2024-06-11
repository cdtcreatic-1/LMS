import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { NgClass } from '@angular/common';
import { MenuLateralService } from 'src/app/profiles/service/menu-lateral.service';
import { BodyBusinessmanService } from '../../body-businessman/services/body-businessman.service';
import {
  selectBusinessProfile,
  selectDataUser,
} from 'src/app/store/selectors/global.selector';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddProfileComponent } from 'src/app/profiles/shared/add-profile/add-profile.component';

@Component({
  selector: 'app-accordion-businessman',
  templateUrl: './accordion-businessman.component.html',
  styleUrls: ['./accordion-businessman.component.css'],
  standalone: true,
  imports: [NgClass, MatDialogModule],
})
export class AccordionBusinessmanComponent implements OnInit {
  isAccordionObs$: Observable<boolean>;
  isAccordion: boolean;

  actualId: number = NaN;

  constructor(
    private mlateral: MenuLateralService,
    private store: Store<AppState>,
    private matdialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAccordionObs$ = this.mlateral.getisAccordion;
    this.isAccordionObs$.subscribe((index) => (this.isAccordion = index));

    this.store.select(selectDataUser).subscribe((data) => {
      this.actualId = data.actualId;
    });
  }

  setBodyBusinessman(id: number) {
    this.mlateral.setItemMenuLateral(1);
    switch (id) {
      case 1:
        this.matdialog.open(AddProfileComponent);
        break;
      case 2:
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 4 }));
        break;
      case 3:
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 5 }));
        break;
      case 4:
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 6 }));
        break;
      default:
        break;
    }
  }
}
