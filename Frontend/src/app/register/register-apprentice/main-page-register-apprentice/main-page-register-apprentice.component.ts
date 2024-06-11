import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ROUTES } from 'src/app/shared/constants';
import { AppState } from 'src/app/store/app.state';
import {
  selectErrorMessage,
  selectLoading,
} from 'src/app/store/selectors/global.selector';

import { FlotingAlertComponent } from '../../../shared/floting-alert/floting-alert.component';
import { NgClass, NgIf } from '@angular/common';
import { FormRegisterApprenticeComponent } from '../form-register-apprentice/form-register-apprentice.component';
import { TitleComponent } from '../../shared/title/title.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';

@Component({
  selector: 'app-main-page-register-apprentice',
  templateUrl: './main-page-register-apprentice.component.html',
  styleUrls: ['./main-page-register-apprentice.component.css'],
  standalone: true,
  imports: [
    TitleComponent,
    FormRegisterApprenticeComponent,
    NgIf,
    NgClass,
    FlotingAlertComponent,
    MatDialogModule,
    LoadingComponent,
  ],
})
export class MainPageRegisterApprenticeComponent implements OnInit, OnDestroy {
  message: string = '';
  isErrorAlert: boolean = false;
  isLoading: boolean = false;

  suscription: Subscription = new Subscription();

  constructor(private router: Router, private store: Store<AppState>) {
    // ProtectedRouteAdminLogin(this.router);
  }

  home() {
    this.router.navigate([ROUTES.HOME]);
  }

  ngOnInit(): void {
    const suscruption1 = this.store
      .select(selectErrorMessage)
      .subscribe((data) => {
        this.message = data.message;
        this.isErrorAlert = data.isError;
      });

    this.suscription.add(suscruption1);

    const suscription3 = this.store.select(selectLoading).subscribe((data) => {
      this.isLoading = data.isLoading;
    });

    this.suscription.add(suscription3);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
