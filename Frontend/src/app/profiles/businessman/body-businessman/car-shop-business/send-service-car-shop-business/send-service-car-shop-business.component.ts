import { Component } from '@angular/core';
import { CarShopService } from '../service/car-shop.service';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { GlobalButtonsComponent } from '../../../../../shared/global-buttons/global-buttons.component';
import { NgFor, NgStyle } from '@angular/common';
import { GlobalSubtitlesComponent } from '../../../../../shared/global-subtitles/global-subtitles.component';
import { GlobalTitlesComponent } from '../../../../../shared/global-titles/global-titles.component';

@Component({
    selector: 'app-send-service-car-shop-business',
    templateUrl: './send-service-car-shop-business.component.html',
    styleUrls: ['./send-service-car-shop-business.component.css'],
    standalone: true,
    imports: [
        GlobalTitlesComponent,
        GlobalSubtitlesComponent,
        NgFor,
        NgStyle,
        GlobalButtonsComponent,
    ],
})
export class SendServiceCarShopBusinessComponent {
  dataShippings = [
    {
      id: 1,
      name: 'DHL Express',
      description: 'Tiempo estimado de entrega: 10 de abril / 30 de abril',
      Price: 'Free shipping',
      image: '../../../../../../assets/send1.webp',
      isSelected: true,
    },
    {
      id: 2,
      name: 'FedEX',
      description: 'Tiempo estimado de entrega: 10 de abril / 30 de abril',
      Price: '$35.00',
      image: '../../../../../../assets/send2.webp',
      isSelected: false,
    },
    {
      id: 3,
      name: 'UPS',
      description: 'Tiempo estimado de entrega: 10 de abril / 30 de abril',
      Price: '$38.00',
      image: '../../../../../../assets/send3.webp',
      isSelected: false,
    },
  ];

  constructor(
    private bbusinessmanService: BodyBusinessmanService,
    private store: Store<AppState>
  ) {}

  changeAverageSend(id: number) {
    const newData = this.dataShippings.map((item) => {
      if (item.id === id) {
        return { ...item, isSelected: true };
      } else {
        return { ...item, isSelected: false };
      }
    });
    this.dataShippings = newData;
  }

  paymentCancel() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 8 }));
  }

  paymentContinue() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 10 }));
  }
}
