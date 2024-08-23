import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { DataOffertLost } from 'src/app/profiles/businessman/body-businessman/interfaces';
import { BodyFarmerService } from '../../services/body-farmer.service';
import { NgFor, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';

@Component({
  selector: 'app-modal-ofert-lots',
  templateUrl: './modal-ofert-lots.component.html',
  styleUrls: ['./modal-ofert-lots.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, GlobalButtonsComponent],
})
export class ModalOfertLotsComponent {
  dataLots: DataOffertLost[] = [];

  idBuyer: number = NaN;

  constructor(
    private store: Store<AppState>,
    private bfservice: BodyFarmerService,
    private matDialog: MatDialog
  ) {
    this.store.select(selectDataUser).subscribe((data) => {
      this.dataLots = data.dataOffertLots;
      this.idBuyer = data.idBuyerSelected;
    });
  }

  sendOfert(idLot: number) {
    this.bfservice
      .setNotificatonOfertLot(this.idBuyer, idLot, 1)
      .subscribe((res) => {
        if (!res) {
          this.matDialog.closeAll();

          this.store.dispatch(
            setIsErrorMessage({
              message: 'No se puede ofertar un mismo lote mas de 3 veces',
            })
          );
          return;
        }

        this.matDialog.closeAll();

        this.store.dispatch(
          setIsErrorMessage({
            message: 'Notificación enviada exitosamente',
            good: true,
          })
        );
      });
  }
}
