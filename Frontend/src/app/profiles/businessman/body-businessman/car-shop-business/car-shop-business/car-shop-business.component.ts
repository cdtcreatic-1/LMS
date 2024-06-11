import { Component, OnInit } from '@angular/core';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectBusinessProfile } from 'src/app/store/selectors/global.selector';
import { DataCarShop } from '../../interfaces';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { setCountCarShop } from 'src/app/store/actions/user-menu-businessman.actions';
import { GlobalButtonsComponent } from '../../../../../shared/global-buttons/global-buttons.component';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-car-shop-business',
  templateUrl: './car-shop-business.component.html',
  styleUrls: ['./car-shop-business.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, GlobalButtonsComponent, DecimalPipe],
})
export class CarShopBusinessComponent implements OnInit {
  dataLotsCarShop: DataCarShop[] = [];
  totalPrice: number = NaN;

  constructor(
    private bbusinessmanService: BodyBusinessmanService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.select(selectBusinessProfile).subscribe((data) => {
      this.dataLotsCarShop = data.dataCarShop;
      let totalPrice = 0;
      this.dataLotsCarShop.forEach((lot) => {
        totalPrice += lot.quantity * lot.Lot.LotQuantity.price_per_kilo;
      });

      this.totalPrice = totalPrice;
    });
  }

  deleteProduct(idLot: number) {
    this.bbusinessmanService.deleteCarShop(idLot).subscribe((res) => {
      if (!res) return;
      this.bbusinessmanService.getCarShop();
    });
  }

  moreProductFarmer(idFarmer: number) {
    this.bbusinessmanService.getLotsFarmerInBusinessman(idFarmer);
    this.bbusinessmanService.getDataFarmer(idFarmer);
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 2 }));
  }

  countProduct(idProduct: number, status: number, quantity: number) {
    if (quantity === 2 && status < 1) return;
    this.store.dispatch(setCountCarShop({ idCar: idProduct, status }));
  }

  sendContinue() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 9 }));
  }
}
