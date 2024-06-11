import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { selectBusinessProfile } from 'src/app/store/selectors/global.selector';
import { DataLot } from '../../interfaces';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { BodyBusinessmanService } from '../services/body-businessman.service';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { DataLots } from '../interfaces';
import {
  setChangeActualIdDasboard,
  setSampleLot,
} from 'src/app/store/actions/user-menu.actions';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfimationSampleComponent } from '../our-farmers-businessman/modal-confimation-sample/modal-confimation-sample.component';
import {
  setResponseSearchProducts,
  setShowModalSearchProducts,
} from 'src/app/store/actions/user-menu-businessman.actions';

@Component({
  selector: 'app-response-search-products',
  templateUrl: './response-search-products.component.html',
  styleUrls: ['./response-search-products.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, GlobalButtonsComponent],
})
export class ResponseSearchProductsComponent implements OnInit {
  dataLots: DataLot[] = [];

  suscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private bbservice: BodyBusinessmanService,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    const suscription1 = this.store
      .select(selectBusinessProfile)
      .subscribe((data) => {
        this.dataLots = data.dataReponseSearchProducts
          ? data.dataReponseSearchProducts.data
          : [];
      });

    this.suscription.add(suscription1);
  }

  getSample(dataLot: DataLot) {
    // this.store.dispatch(setSampleLot({ data: dataLot }));
    this.matDialog.open(ModalConfimationSampleComponent);
  }

  addCarShop(lot: DataLot) {
    this.bbservice
      .setCarShop(lot.farm_info.id_farm, lot.id_lot)
      .subscribe((res) => {
        if (!res) {
          this.store.dispatch(
            setIsErrorMessage({
              message:
                'El producto seleccionado ya se encuentra en al carro de compras',
            })
          );
          return;
        }
        this.bbservice.getCarShop();
      });
  }

  sendCarShop(lot: DataLot) {
    this.bbservice
      .setCarShop(lot.farm_info.id_farm, lot.id_lot)
      .subscribe((resAddLot) => {
        if (!resAddLot) {
          this.store.dispatch(
            setIsErrorMessage({
              message:
                'El producto seleccionado ya se encuentra en al carro de compras',
            })
          );
          return;
        }
        this.bbservice.getCarShop();
        this.store.dispatch(setShowModalSearchProducts({ value: false }));
        this.store.dispatch(setResponseSearchProducts({ data: undefined }));
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 8 }));
      });
  }
}
