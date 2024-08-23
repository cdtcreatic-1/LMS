import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { AppState } from 'src/app/store/app.state';
import {
  setChangeActualIdDasboard,
  setDataLotsByFarm,
  setLotSelected,
} from 'src/app/store/actions/user-menu.actions';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { StartsComponent } from 'src/app/shared/starts/starts.component';
import { ResponseTotalLots } from 'src/app/profiles/farmer/interfaces';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalTrazabilityProductComponent } from '../modal-trazability-product/modal-trazability-product.component';
import { DeleteLotsComponent } from '../../shared/delete-lots/delete-lots.component';

@Component({
  selector: 'app-my-products-farmer',
  templateUrl: './my-products-farmer.component.html',
  styleUrls: ['./my-products-farmer.component.css'],
  standalone: true,
  imports: [NgIf, NgClass, StartsComponent, NgFor, MatDialogModule],
})
export class MyProductsFarmerComponent implements OnInit, OnDestroy {
  dataLots: ResponseTotalLots[] = [];
  nameFarm: string = '';
  suscription = new Subscription();

  constructor(private store: Store<AppState>, private matDialog: MatDialog) {}

  ngOnInit(): void {
    const suscription1 = this.store.select(selectDataUser).subscribe((data) => {
      this.dataLots = data.dataLotsByFarm;
      this.nameFarm = data.farmSelected?.farm_name!;
    });

    this.suscription.add(suscription1);
  }

  onClickBack() {
    this.store.dispatch(setDataLotsByFarm({ allLots: [] }));
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
  }

  onClickAddProduct() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 2.1 }));
  }

  onClickDeleteFarm() {
    this.matDialog.open(DeleteLotsComponent);
  }

  onClickTraceability(lot: ResponseTotalLots) {
    this.store.dispatch(setLotSelected({ lot: lot.LotSummary }));
    this.matDialog.open(ModalTrazabilityProductComponent);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
