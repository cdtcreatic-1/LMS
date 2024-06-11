import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalDetailLotComponent } from '../modal-detail-lot/modal-detail-lot.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { DataNotificationBusinessman } from '../../interfaces';
import { selectBusinessProfile } from 'src/app/store/selectors/global.selector';
import { setDataLotDescription } from 'src/app/store/actions/user-menu-businessman.actions';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-offers-received-businessman',
    templateUrl: './offers-received-businessman.component.html',
    styleUrls: ['./offers-received-businessman.component.css'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        IonicModule,
    ],
})
export class OffersReceivedBusinessmanComponent {
  dataNotification: DataNotificationBusinessman[] = [];

  constructor(
    private matDialog: MatDialog,
    private store: Store<AppState>,
    private bbservice: BodyBusinessmanService
  ) {
    this.store.select(selectBusinessProfile).subscribe((data) => {
      this.dataNotification = data.dataNotification;
    });
  }

  openModal(lot: DataNotificationBusinessman) {
    this.store.dispatch(setDataLotDescription({ data: lot }));
    this.matDialog.open(ModalDetailLotComponent);
  }

  acceptDecline(idSeller: number, idLot: number, idStatus: number) {
    this.bbservice
      .setNotificationBusinessmanPUT(idSeller, idLot, idStatus)
      .subscribe((response) => {
        if (!response) {
          this.store.dispatch(
            setIsErrorMessage({
              message: 'Error al enviar notificación, intentalo más tarde',
            })
          );
          return;
        }
        this.bbservice.getCarShop();
        this.bbservice.getNotificationBusinessman();
      });

    this.matDialog.closeAll();
  }
}
