import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BodyFarmerService } from '../services/body-farmer.service';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import {
  selectDataShared,
  selectDataUser,
  selectErrorMessage,
  selectLoading,
} from 'src/app/store/selectors/global.selector';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MainPageBodyFarmerComponent } from '../body-farmer/main-page-body-farmer/main-page-body-farmer.component';
import { AddFarmComponent } from '../body-farmer/add-farm/add-farm.component';
import { HeaderFarmerComponent } from '../header-farmer/header-farmer.component';
import { NgClass, NgIf } from '@angular/common';
import { DataUserFarmer } from 'src/app/register/register-farmer/interface';
import { BusinessmanComponent } from 'src/app/profiles/farmer/body-farmer/add-profiles/businessman/businessman.component';
import { ApprenticeComponent } from 'src/app/profiles/farmer/body-farmer/add-profiles/apprentice/apprentice.component';
import { NavbarFarmerComponent } from '../navbar-farmer/navbar-farmer.component';
import { MenuLateralFamerComponent } from '../menu-lateral-farmer/menu-lateral-farmer.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FlotingAlertComponent } from 'src/app/shared/floting-alert/floting-alert.component';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { setActualIdRol } from 'src/app/store/actions/shared.actions';
import { handleSaveActualIdRole } from '../../shared/helpers';
import { ModalReloginComponent } from '../../shared/modal-relogin/modal-relogin.component';

@Component({
  selector: 'app-main-page-farmer',
  templateUrl: './main-page-farmer.component.html',
  styleUrls: ['./main-page-farmer.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    HeaderFarmerComponent,
    NavbarFarmerComponent,
    AddFarmComponent,
    MainPageBodyFarmerComponent,
    BusinessmanComponent,
    ApprenticeComponent,
    MenuLateralFamerComponent,
    FlotingAlertComponent,
    LoadingComponent,
    MatDialogModule,
  ],
})
export class MainPageFarmerComponent implements OnInit, OnDestroy {
  rol$: Observable<number>;
  rol: number = 1;

  itemBodyFarmerObs$: Observable<string>;
  itemBodyFarmer: string;

  actualId: number;
  dataUser: DataUserFarmer;

  idRole: number = NaN;
  isLoading: boolean = false;
  isErrorAlert: boolean = false;
  message: string = '';
  goodMessage: boolean = false;

  suscription: Subscription[] = [];
  suscriptionWindow: Subscription = new Subscription();

  constructor(
    private bfarmer: BodyFarmerService,
    private grservice: GlobalRegisterService,
    private store: Store<AppState>,
    private sharedService: SharedService,
    private matdialog: MatDialog
  ) {
    // ProtectedRouteAdminLogin(this.router);

    const suscription2 = this.store
      .select(selectErrorMessage)
      .subscribe((data) => {
        this.isErrorAlert = data.isError;
        this.message = data.message;
        this.goodMessage = data.good;
      });

    const suscription3 = this.store.select(selectLoading).subscribe((data) => {
      this.isLoading = data.isLoading;
    });

    this.suscription.push(suscription2);
    this.suscription.push(suscription3);
  }

  ngOnInit(): void {
    this.store.dispatch(setActualIdRol({ id: 1 }));
    handleSaveActualIdRole(1);

    this.rol$ = this.bfarmer.getRol;
    const suscription4 = this.rol$.subscribe((index) => (this.rol = index));

    const suscription5 = this.store.select(selectDataUser).subscribe((data) => {
      this.dataUser = data.dataRegister?.User!;
      this.actualId = data.actualId;
    });

    this.suscription.push(suscription4);
    this.suscription.push(suscription5);

    this.handleRequest();
  }

  handleRequest() {
    const token = localStorage.getItem('@access_token');
    if (!token) {
      this.matdialog.open(ModalReloginComponent);
      return;
    }

    const suscription6 = this.sharedService
      .getVerifyToken(token)
      .subscribe((resToken) => {
        if (!resToken) return;
        if (typeof resToken === 'number') {
          this.matdialog.open(ModalReloginComponent);
          return;
        }

        this.suscriptionWindow.unsubscribe();

        this.suscriptionWindow = this.store
          .select(selectDataShared)
          .subscribe((data) => {
            if (data.dataUserRegister?.hasDocumentation) {
              this.bfarmer.getDocumentsFarmer();
              // this.grservice
              //   .getCurrentWindow(resToken.id_user.toString())
              //   .subscribe((res) => {
              //     if (!res) return;
              //     this.bfarmer.getDocumentsFarmer();
              //   });
            }
          });

        this.grservice.getDataRegisterFarm();
        this.bfarmer.getDataProfileFarm();
        this.bfarmer.getNotification();
        this.bfarmer.getTableStateSell(1);
        this.sharedService.getTrends(2);
        this.sharedService.getDataRegister();
      });

    this.suscription.push(suscription6);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
