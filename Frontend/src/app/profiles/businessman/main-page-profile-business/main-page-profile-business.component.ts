import { Component, OnDestroy, OnInit } from '@angular/core';
import { BodyBusinessmanService } from '../body-businessman/services/body-businessman.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MainPageBodyBusinessmanComponent } from '../body-businessman/main-page-body-businessman/main-page-body-businessman.component';
import { HeaderProfileBusinessComponent } from '../header-profile-business/header-profile-business.component';
import { BodyFarmerService } from '../../farmer/services/body-farmer.service';
import { MenuBusinessComponent } from '../menu-business/menu-business.component';
import { NgClass, NgIf } from '@angular/common';
import { FlotingAlertComponent } from 'src/app/shared/floting-alert/floting-alert.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  selectBusinessProfile,
  selectErrorMessage,
  selectLoading,
} from 'src/app/store/selectors/global.selector';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { Router } from '@angular/router';
import { SearchProductsComponent } from '../search-products/search-products.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { setActualIdRol } from 'src/app/store/actions/shared.actions';
import { handleSaveActualIdRole } from '../../shared/helpers';
import { ModalReloginComponent } from '../../shared/modal-relogin/modal-relogin.component';

@Component({
  selector: 'app-main-page-profile-business',
  templateUrl: './main-page-profile-business.component.html',
  styleUrls: ['./main-page-profile-business.component.css'],
  standalone: true,
  imports: [
    HeaderProfileBusinessComponent,
    MainPageBodyBusinessmanComponent,
    MenuBusinessComponent,
    NgIf,
    NgClass,
    FlotingAlertComponent,
    LoadingComponent,
    SearchProductsComponent,
    MatDialogModule,
  ],
})
export class MainPageBusinessComponent implements OnInit, OnDestroy {
  userId: number = NaN;
  isLoading: boolean = false;
  isErrorAlert: boolean = false;
  message: string = '';
  isModalShowProduct: boolean = false;

  suscription = new Subscription();

  constructor(
    private router: Router,
    private bbservice: BodyBusinessmanService,
    private bfservice: BodyFarmerService,
    private sharedservide: SharedService,
    private store: Store<AppState>,
    private matdialog: MatDialog
  ) {
    // ProtectedRouteAdminLogin(this.router);
  }

  ngOnInit(): void {
    this.store.dispatch(setActualIdRol({ id: 2 }));
    handleSaveActualIdRole(2);

    const userId = localStorage.getItem('@userId');
    this.userId = parseInt(userId!);

    const suscription2 = this.store
      .select(selectErrorMessage)
      .subscribe((data) => {
        this.isErrorAlert = data.isError;
        this.message = data.message;
      });
    this.suscription.add(suscription2);

    const suscription3 = this.store.select(selectLoading).subscribe((data) => {
      this.isLoading = data.isLoading;
    });
    this.suscription.add(suscription3);

    const suscription4 = this.store
      .select(selectBusinessProfile)
      .subscribe((data) => {
        this.isModalShowProduct = data.showModalSearchPrice;
      });

    this.suscription.add(suscription4);

    this.callHTTPRequest();

    // this.bbservice.getDocumentsBusinesman(this.userId);
  }

  callHTTPRequest() {
    const token = localStorage.getItem('@access_token');

    if (!token) {
      this.matdialog.open(ModalReloginComponent);
      return;
    }

    this.sharedservide.getVerifyToken(token).subscribe((res) => {
      if (!res) return;
      if (typeof res === 'number') {
        this.matdialog.open(ModalReloginComponent);
        return;
      }

      this.sharedservide.getDataRegister();
      this.bbservice.getItemsSearhProduct();
      this.bbservice.getFarmers();
      this.bbservice.getCarShop();
      this.bbservice.getNotificationBusinessman();
      this.bfservice.getTableStateSell(2);
      this.sharedservide.getTrends(1);
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
