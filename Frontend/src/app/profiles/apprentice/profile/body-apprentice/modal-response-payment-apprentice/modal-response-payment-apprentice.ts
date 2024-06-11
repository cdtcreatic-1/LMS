import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  selectApprentice,
  selectBusinessProfile,
} from 'src/app/store/selectors/global.selector';

import { NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GlobalTitlesComponent } from 'src/app/shared/global-titles/global-titles.component';
import { GlobalSubtitlesComponent } from 'src/app/shared/global-subtitles/global-subtitles.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-response-payment',
  templateUrl: './modal-response-payment-apprentice.html',
  styleUrls: ['./modal-response-payment-apprentice.css'],
  standalone: true,
  imports: [IonicModule, NgIf, GlobalTitlesComponent, GlobalSubtitlesComponent],
})
export class ModalResponsePaymentApprenticeComponent
  implements OnInit, OnDestroy
{
  idPayment: number = 1;
  iconName: string = '';
  title: string = '';
  subtitle: string = '';

  susciption = new Subscription();

  constructor(private matDialog: MatDialog, private store: Store<AppState>) {}

  ngOnInit() {
    const suscription1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.idPayment = data.idStatusPayment;
        switch (data.idStatusPayment) {
          case 1:
            this.iconName = 'checkmark-circle-outline';
            this.title = 'Felicitaciones';
            this.subtitle = 'el págo fue exitoso';
            break;
          case 2:
            this.iconName = 'ban-outline';
            this.title = 'Lo sentimos';
            this.subtitle = 'no se puedo realizar el pago';
            break;
          case 3:
            this.iconName = 'battery-half-outline';
            this.title = 'Estamos procesando';
            this.subtitle = 'tu pago';
            break;
          default:
            break;
        }
      });

    this.susciption.add(suscription1);
  }

  handleCloseModal() {
    this.matDialog.closeAll();
  }

  ngOnDestroy(): void {
    this.susciption.unsubscribe();
  }
}
