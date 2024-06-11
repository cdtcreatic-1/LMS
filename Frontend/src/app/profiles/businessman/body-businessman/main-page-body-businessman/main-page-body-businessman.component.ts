import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BodyBusinessmanService } from '../services/body-businessman.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { StateSentBusinessmanComponent } from '../state-sent-businessman/state-sent-businessman.component';
import { PaymentServiceCarShopBusinessComponent } from '../car-shop-business/payment-service-car-shop-business/payment-service-car-shop-business.component';
import { InformationSendComponent } from '../car-shop-business/information-send/information-send.component';
import { SendServiceCarShopBusinessComponent } from '../car-shop-business/send-service-car-shop-business/send-service-car-shop-business.component';
import { CarShopBusinessComponent } from '../car-shop-business/car-shop-business/car-shop-business.component';
import { MainPageNotificationBusinessmanComponent } from '../notification-businessman/main-page-notification-businessman/main-page-notification-businessman.component';
import { DocumentsBusinessmanComponent } from '../documents-businessman/documents-businessman.component';
import { DetailsOurFarmersBusinessmanComponent } from '../our-farmers-businessman/details-our-farmers-businessman/details-our-farmers-businessman.component';
import { OurFarmersBusinessmanComponent } from '../our-farmers-businessman/our-farmers-businessman/our-farmers-businessman.component';
import { NgIf } from '@angular/common';
import { EditProfileBusinessmanComponent } from '../edit-profile-businessman/edit-profile-businessman.component';
import { UpdatePasswordComponent } from 'src/app/profiles/shared/update-password/update-password.component';
import { ResponseSearchProductsComponent } from '../response-search-products/response-search-products.component';
import { TrendsFarmersComponent } from 'src/app/home/trends-farmers/trends-farmers.component';

@Component({
  selector: 'app-main-page-body-businessman',
  templateUrl: './main-page-body-businessman.component.html',
  styleUrls: ['./main-page-body-businessman.component.css'],
  standalone: true,
  imports: [
    NgIf,
    OurFarmersBusinessmanComponent,
    DetailsOurFarmersBusinessmanComponent,
    DocumentsBusinessmanComponent,
    EditProfileBusinessmanComponent,
    UpdatePasswordComponent,
    MainPageNotificationBusinessmanComponent,
    CarShopBusinessComponent,
    SendServiceCarShopBusinessComponent,
    InformationSendComponent,
    PaymentServiceCarShopBusinessComponent,
    StateSentBusinessmanComponent,
    ResponseSearchProductsComponent,
    TrendsFarmersComponent,
  ],
})
export class MainPageBodyBusinessmanComponent implements OnInit {
  actualId: number;

  modalNotificationObs$: Observable<boolean>;
  modalNotification: boolean = false;

  constructor(
    private bbusinessman: BodyBusinessmanService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.select(selectDataUser).subscribe((data) => {
      this.actualId = data.actualId;
    });

    this.modalNotificationObs$ = this.bbusinessman.getModalNotification;
    this.modalNotificationObs$.subscribe(
      (index) => (this.modalNotification = index)
    );
  }
}
