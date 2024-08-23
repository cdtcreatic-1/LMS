import { Component } from '@angular/core';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectBusinessProfile } from 'src/app/store/selectors/global.selector';
import { DataFarmerSelected, DataLots, Farmers } from '../../interfaces';
import {
  setChangeActualIdDasboard,
  setSampleLot,
} from 'src/app/store/actions/user-menu.actions';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfimationSampleComponent } from '../modal-confimation-sample/modal-confimation-sample.component';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { GlobalButtonsComponent } from '../../../../../shared/global-buttons/global-buttons.component';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-details-our-farmers-businessman',
  templateUrl: './details-our-farmers-businessman.component.html',
  styleUrls: ['./details-our-farmers-businessman.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, GlobalButtonsComponent, DecimalPipe],
})
export class DetailsOurFarmersBusinessmanComponent {
  dataFarmer: DataFarmerSelected;
  dataLots: DataLots[] = [];

  suscription = new Subscription();

  ismodal: boolean = false;

  constructor(
    private bbusimessman: BodyBusinessmanService,
    private store: Store<AppState>,
    private matDialog: MatDialog
  ) {
    this.store.select(selectBusinessProfile).subscribe((data) => {
      this.dataFarmer = data.dataFarmerSelected!;
      this.dataLots = data.dataLots;
    });
  }

  change() {
    this.bbusimessman.setBodyBusinessman('BP0B');
  }

  getSample(dataLot: DataLots) {
    this.store.dispatch(setSampleLot({ data: dataLot }));
    this.matDialog.open(ModalConfimationSampleComponent);
  }

  addCarShop(idLot: number) {
    this.bbusimessman
      .setCarShop(this.dataFarmer.id_farmer, idLot)
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
        this.bbusimessman.getCarShop();
      });
  }

  sendCarShop(idLot: number) {
    this.bbusimessman
      .setCarShop(this.dataFarmer.id_farmer, idLot)
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
        this.bbusimessman.getCarShop();
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 8 }));
      });
  }
}
