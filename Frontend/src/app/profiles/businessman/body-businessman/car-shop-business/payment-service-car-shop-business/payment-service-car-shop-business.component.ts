import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { AppState } from 'src/app/store/app.state';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { RequestPurchase } from '../../interfaces';
import { CarShopService } from '../service/car-shop.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GlobalButtonsComponent } from '../../../../../shared/global-buttons/global-buttons.component';
import { NgStyle } from '@angular/common';
import { GlobalSubtitlesComponent } from '../../../../../shared/global-subtitles/global-subtitles.component';
import { GlobalTitlesComponent } from '../../../../../shared/global-titles/global-titles.component';

@Component({
  selector: 'app-payment-service-car-shop-business',
  templateUrl: './payment-service-car-shop-business.component.html',
  styleUrls: ['./payment-service-car-shop-business.component.css'],
  standalone: true,
  imports: [
    GlobalTitlesComponent,
    GlobalSubtitlesComponent,
    NgStyle,
    GlobalButtonsComponent,
  ],
})
export class PaymentServiceCarShopBusinessComponent implements OnInit {
  cardVisa = true;
  cardPaypal = false;

  window: any = window;

  constructor(
    private store: Store<AppState>,
    private bbservice: BodyBusinessmanService,
    private carshopService: CarShopService
  ) {}

  ngOnInit() {}

  changeCardSelected(id: number) {
    if (id === 1) {
      this.cardVisa = true;
      this.cardPaypal = false;
    } else {
      this.cardVisa = false;
      this.cardPaypal = true;
    }
  }

  cancel() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 8 }));
  }

  buyProduct() {
    const body: RequestPurchase = {
      id_shipping_option: 1,
      additional_notes: 'Casa 2',
      shipping_address: 'Vereda La Mulata',
    };

    this.bbservice.setPurchase(body).subscribe((res) => {
      if (!res) return;
      this.carshopService.initEpaycoButton(res.session_id);
    });
  }
}
