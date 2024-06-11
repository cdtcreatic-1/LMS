import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectBusinessProfile } from 'src/app/store/selectors/global.selector';
import { GlobalSubtitlesComponent } from '../../../../../shared/global-subtitles/global-subtitles.component';
import { GlobalTitlesComponent } from '../../../../../shared/global-titles/global-titles.component';
import { NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-modal-response-payment',
    templateUrl: './modal-response-payment.component.html',
    styleUrls: ['./modal-response-payment.component.css'],
    standalone: true,
    imports: [
        IonicModule,
        NgIf,
        GlobalTitlesComponent,
        GlobalSubtitlesComponent,
    ],
})
export class ModalResponsePaymentComponent implements OnInit {
  idPayment: number = 1;
  iconName: string = '';
  title: string = '';
  subtitle: string = '';

  constructor(private matDialog: MatDialog, private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(selectBusinessProfile).subscribe((data) => {
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
  }

  handleCloseModal() {
    this.matDialog.closeAll();
  }
}
