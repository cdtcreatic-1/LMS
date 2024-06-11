import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  selectDataCurrentWindow,
  selectErrorMessage,
  selectLoading,
} from 'src/app/store/selectors/global.selector';
import { WelcomeComponent } from '../../shared/welcome/welcome.component';
import { TitleComponent } from '../../shared/title/title.component';
import { IndicatorComponent } from '../indicator/indicator.component';
import { FlotingAlertComponent } from '../../../shared/floting-alert/floting-alert.component';
import { NgClass, NgIf } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DataRegister } from '../interface';
import { FormRegisterFarmerComponent } from '../form-register-farmer/form-register-farmer.component';
import { FormUserCreatedComponent } from '../form-user-created/form-user-created.component';
import { FormMapFarmerComponent } from '../form-map-farmer/form-map-farmer.component';
import { FormReviewComponent } from '../form-review/form-review.component';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { ProtectedRouteAdminLogin } from 'src/app/shared/helpers';

@Component({
  selector: 'app-main-page-register',
  templateUrl: './main-page-register.component.html',
  styleUrls: ['./main-page-register.component.css'],
  standalone: true,
  imports: [
    NgIf,
    FormRegisterFarmerComponent,
    FormMapFarmerComponent,
    FormReviewComponent,
    FormUserCreatedComponent,
    FlotingAlertComponent,
    IndicatorComponent,
    TitleComponent,
    WelcomeComponent,
    MatDialogModule,
    NgClass,
    LoadingComponent,
    RouterOutlet,
    RouterLink,
  ],
})
export class MainPageRegisterComponent implements OnInit, OnDestroy {
  currentWindowId: number;
  title: string = 'Datos esenciales';

  welcome$: Observable<boolean>;
  welcome: boolean = false;

  isModal: boolean = true;
  isLoading: boolean = false;

  currentRegisterFarmer = undefined;
  dataUser?: DataRegister = undefined;

  storage?: string = undefined;
  message: string = '';
  isErrorAlert: boolean = false;

  private suscription: Subscription[] = [];

  constructor(private router: Router, private store: Store<AppState>) {
    // ProtectedRouteAdminLogin(this.router);

    const suscription2 = this.store.select(selectLoading).subscribe((data) => {
      this.isLoading = data.isLoading;
    });

    this.suscription.push(suscription2);
  }

  ngOnInit(): void {
    const suscription1 = this.store
      .select(selectErrorMessage)
      .subscribe((data) => {
        this.message = data.message;
        this.isErrorAlert = data.isError;
      });

    const suscription2 = this.store
      .select(selectDataCurrentWindow)
      .subscribe((data) => {
        this.currentWindowId = data.actualCurrentWindow
          ? data.actualCurrentWindow
          : 11;
      });

    this.suscription.push(suscription1);
    this.suscription.push(suscription2);
  }

  closeModal() {
    this.isModal = false;
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
