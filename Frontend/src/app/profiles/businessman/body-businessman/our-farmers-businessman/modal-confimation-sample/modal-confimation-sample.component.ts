import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  selectBusinessProfile,
  selectDataUser,
} from 'src/app/store/selectors/global.selector';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { DataFarmerSelected, DataLots } from '../../interfaces';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { GlobalButtonsComponent } from '../../../../../shared/global-buttons/global-buttons.component';

@Component({
    selector: 'app-modal-confimation-sample',
    templateUrl: './modal-confimation-sample.component.html',
    styleUrls: ['./modal-confimation-sample.component.css'],
    standalone: true,
    imports: [GlobalButtonsComponent],
})
export class ModalConfimationSampleComponent {
  profileTaza: string = '';
  dataLotSample: DataLots;
  dataFarmer: DataFarmerSelected;

  constructor(
    private store: Store<AppState>,
    private matDialog: MatDialog,
    private bbusimessman: BodyBusinessmanService
  ) {
    this.store.select(selectDataUser).subscribe((data) => {
      this.profileTaza = data.dataSampleLot?.CoffeeProfile.profile_name!;
      this.dataLotSample = data.dataSampleLot!;
    });

    this.store.select(selectBusinessProfile).subscribe((data) => {
      this.dataFarmer = data.dataFarmerSelected!;
    });
  }

  closeModal() {
    this.matDialog.closeAll();
  }

  buySampleLot() {
    this.matDialog.closeAll();
    this.bbusimessman
      .setCarShop(this.dataFarmer.id_farmer, this.dataLotSample.id_lot)
      .subscribe((res) => {
        if (!res) return;
        this.bbusimessman.getCarShop();
        this.matDialog.closeAll();
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 8 }));
      });
  }
}
