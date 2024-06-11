import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BodyFarmerService } from '../../services/body-farmer.service';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import {
  selectDataCurrentWindow,
  selectDataUser,
} from 'src/app/store/selectors/global.selector';
import { TradingBusinessComponent } from '../trading-business/trading-business.component';
import { HistorySalesComponent } from '../history-sales/history-sales.component';
import { ModalNotificationFarmerComponent } from '../modal-notification-farmer/modal-notification-farmer.component';
import { NotificationFarmerComponent } from '../notification-farmer/notification-farmer.component';
import { EditProfileFarmerComponent } from '../edit-profile-farmer/edit-profile-farmer.component';
import { LoadDocumentsComponent } from '../document-farmer/load-documents/load-documents.component';
import { DocumentFarmerComponent } from '../document-farmer/show-documents/document-farmer.component';
import { AddLotsComponent } from '../add-lots/add-lots.component';
import { MyProductsFarmerComponent } from '../my-products-farmer/my-products-farmer.component';
import { DetailsFarmerComponent } from '../details-farmer/details-farmer.component';
import { NgClass, NgIf } from '@angular/common';

import { DialogModule } from '@angular/cdk/dialog';
import { UpdatePasswordComponent } from 'src/app/profiles/shared/update-password/update-password.component';

@Component({
  selector: 'app-main-page-body-farmer',
  templateUrl: './main-page-body-farmer.component.html',
  styleUrls: ['./main-page-body-farmer.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    DetailsFarmerComponent,
    MyProductsFarmerComponent,
    AddLotsComponent,
    DocumentFarmerComponent,
    LoadDocumentsComponent,
    EditProfileFarmerComponent,
    UpdatePasswordComponent,
    NotificationFarmerComponent,
    ModalNotificationFarmerComponent,
    HistorySalesComponent,
    TradingBusinessComponent,
    DialogModule,
  ],
})
export class MainPageBodyFarmerComponent implements OnInit, OnDestroy {
  actualId: number = NaN;

  modalNotificationObs$: Observable<boolean>;
  modalNotification: boolean = false;

  currentWindowId: number = NaN;

  suscription: Subscription[] = [];

  constructor(
    private bfarmer: BodyFarmerService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.modalNotificationObs$ = this.bfarmer.getModalNotification;
    this.suscription.push(
      this.modalNotificationObs$.subscribe(
        (index) => (this.modalNotification = index)
      )
    );

    this.suscription.push(
      this.store.select(selectDataCurrentWindow).subscribe((data) => {
        this.currentWindowId = data.dataCurrentWindow?.current_window_id!;
      })
    );

    this.suscription.push(
      this.store.select(selectDataUser).subscribe((data) => {
        this.actualId = data.actualId;
      })
    );
  }

  ngOnDestroy(): void {
    console.log('Destruye el componente');
    this.suscription.forEach((suscription) => suscription.unsubscribe());
  }
}
