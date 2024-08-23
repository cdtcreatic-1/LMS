import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DataTrends } from 'src/app/shared/interfaces';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { ModalOfertLotsComponent } from '../modal-ofert-lots/modal-ofert-lots.component';
import { BodyFarmerService } from '../../services/body-farmer.service';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { NgFor, NgIf, NgStyle, TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-trading-business',
    templateUrl: './trading-business.component.html',
    styleUrls: ['./trading-business.component.css'],
    standalone: true,
    imports: [
        NgFor,
        NgIf,
        NgStyle,
        TitleCasePipe,
    ],
})
export class TradingBusinessComponent {
  dataTrend: DataTrends[] = [];

  constructor(
    private store: Store<AppState>,
    private matDialog: MatDialog,
    private bfservice: BodyFarmerService
  ) {
    this.store.select(selectDataUser).subscribe((data) => {
      this.dataTrend = data.dataTrends;
    });
  }

  openModal(idBuyer: number) {
    this.bfservice.getOffertLot(idBuyer).subscribe((res) => {
      if (!res) {
        this.store.dispatch(
          setIsErrorMessage({
            message: 'Error al cargar lotes, intentelo más tarde',
          })
        );
        return;
      }
    });
    this.matDialog.open(ModalOfertLotsComponent);
  }
}
//
