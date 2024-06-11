import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  selectApprentice,
  selectDataShared,
} from 'src/app/store/selectors/global.selector';
import { CartCourse, CoursePurchaseData } from '../../interfaces';
import { Subscription } from 'rxjs';
import { ApprenticeService } from '../../services/apprentice.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { setChangeActualIdApprentice } from 'src/app/store/actions/user-menu-apprentice.action';

@Component({
  selector: 'app-car-shop',
  templateUrl: './car-shop.component.html',
  styleUrls: ['./car-shop.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, IonicModule, GlobalButtonsComponent, DecimalPipe],
})
export class CarShopComponent implements OnInit, OnDestroy {
  dataCarShop: CartCourse[] = [];
  idUser: number = NaN;
  totalPrice: number = NaN;

  suscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private apprenticeService: ApprenticeService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const suscription1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.dataCarShop = data.dataCartShop;
        let totalPrice = 0;
        this.dataCarShop.forEach((course) => {
          totalPrice += course.Course.course_price;
        });

        this.totalPrice = totalPrice;
      });

    const suscription2 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        this.idUser = data.dataUserRegister?.id_user!;
      });

    this.suscription.add(suscription1);
    this.suscription.add(suscription2);
  }

  deleteCartShop(idCourse: number) {
    const suscription3 = this.apprenticeService
      .deleteCardShop(this.idUser, idCourse)
      .subscribe((res) => {
        if (!res) return;
        this.apprenticeService.getCarShop(this.idUser);
      });

    this.suscription.add(suscription3);
  }

  handleBuy() {
    const dataShopping: CoursePurchaseData[] = [];
    this.dataCarShop.forEach((course) => {
      dataShopping.push({ id_cart_course: course.id_cart_course });
    });

    this.apprenticeService
      .setPurchaseApprentice(dataShopping)
      .subscribe((res) => {
        if (!res) return;
        this.sharedService.initEpaycoButton(res.purchases[0].session_id);
      });
  }

  continueShopping() {
    this.store.dispatch(setChangeActualIdApprentice({ value: 1 }));
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
