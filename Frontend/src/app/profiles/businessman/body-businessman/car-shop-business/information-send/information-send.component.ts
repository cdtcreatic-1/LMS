import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { AppState } from 'src/app/store/app.state';
import { GlobalButtonsComponent } from '../../../../../shared/global-buttons/global-buttons.component';
import { GlobalSubtitlesComponent } from '../../../../../shared/global-subtitles/global-subtitles.component';
import { GlobalTitlesComponent } from '../../../../../shared/global-titles/global-titles.component';
import { RequestPurchase } from '../../interfaces';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { CarShopService } from '../service/car-shop.service';

@Component({
  selector: 'app-information-send',
  templateUrl: './information-send.component.html',
  styleUrls: ['./information-send.component.css'],
  standalone: true,
  imports: [
    GlobalTitlesComponent,
    GlobalSubtitlesComponent,
    GlobalButtonsComponent,
  ],
})
export class InformationSendComponent implements OnInit {
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

      // this.callepayco(res.purchaseData.session_id, '5000');

      // this.bbservice
      //   .setChangeStatusPurchase(res.purchaseData.id_purchase, 2)
      //   .subscribe((res2) => {
      //     if (!res2) return;
      //     this.bbservice.getCarShop();
      //     this.store.dispatch(setChangeActualIdDasboard({ actualId: 9 }));
      //   });
    });
  }
}
