import { Component, Pipe } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { DataNotificationBusinessman } from '../../interfaces';
import { selectBusinessProfile } from 'src/app/store/selectors/global.selector';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { MatDialog } from '@angular/material/dialog';
import { GlobalButtonsComponent } from '../../../../../shared/global-buttons/global-buttons.component';
import { NgIf, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-modal-detail-lot',
    templateUrl: './modal-detail-lot.component.html',
    styleUrls: ['./modal-detail-lot.component.css'],
    standalone: true,
    imports: [
        NgIf,
        GlobalButtonsComponent,
        DecimalPipe,
    ],
})
export class ModalDetailLotComponent {
  dataLot?: DataNotificationBusinessman;

  constructor(
    private store: Store<AppState>,
    private bbservice: BodyBusinessmanService,
    private matDialog: MatDialog
  ) {
    this.store.select(selectBusinessProfile).subscribe((data) => {
      this.dataLot = data.dataLotDescription;
    });
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
        this.bbservice.getNotificationBusinessman();
        this.bbservice.getCarShop();
      });

    this.matDialog.closeAll();
  }
}
