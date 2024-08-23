import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ROUTES } from 'src/app/shared/constants';
import { Store } from '@ngrx/store';
import {
  selectErrorMessage,
  selectLoading,
} from 'src/app/store/selectors/global.selector';
import { AppState } from 'src/app/store/app.state';
import { clearStore } from 'src/app/store/actions/user-menu.actions';
import { clearCurrentWindow } from 'src/app/store/actions/current-window.actions';
import { RegisterBusinessmanService } from '../services/register-businessman.service';
import { PrincipalRegisterComponent } from '../../principal-register/principal-register.component';
import { WelcomeComponent } from '../../shared/welcome/welcome.component';
import { FlotingAlertComponent } from '../../../shared/floting-alert/floting-alert.component';
import { MainPageForm3BusinessComponent } from '../form3-business/main-page-form3-business/main-page-form3-business.component';
import { Form2BusinessComponent } from '../form2-business/form2-business.component';
import { Form1BusinessComponent } from '../form1-business/form1-business.component';
import { TitleComponent } from '../../shared/title/title.component';
import { NgClass, NgIf } from '@angular/common';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { ProtectedRouteAdminLogin } from 'src/app/shared/helpers';

@Component({
  selector: 'app-main-page-register-business',
  templateUrl: './main-page-register-business.component.html',
  styleUrls: ['./main-page-register-business.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    TitleComponent,
    Form1BusinessComponent,
    Form2BusinessComponent,
    MainPageForm3BusinessComponent,
    FlotingAlertComponent,
    WelcomeComponent,
    PrincipalRegisterComponent,
    LoadingComponent,
    RouterOutlet,
    RouterLink,
  ],
})
export class MainPageRegisterBusinessComponent implements OnInit, OnDestroy {
  welcome$: Observable<boolean>;
  welcome: boolean = false;

  isLoading: boolean = false;
  isModal: boolean = true;

  message: string = '';
  isErrorAlert: boolean = false;

  private suscription: Subscription[] = [];

  constructor(private router: Router, private store: Store<AppState>) {
    // ProtectedRouteAdminLogin(this.router);
  }

  ngOnInit(): void {
    const suscruption2 = this.store
      .select(selectErrorMessage)
      .subscribe((data) => {
        this.message = data.message;
        this.isErrorAlert = data.isError;
      });

    this.suscription.push(suscruption2);

    const suscription4 = this.store.select(selectLoading).subscribe((data) => {
      this.isLoading = data.isLoading;
    });

    this.suscription.push(suscription4);
  }

  home() {
    localStorage.clear();
    this.store.dispatch(clearStore());
    this.store.dispatch(clearCurrentWindow());
    this.router.navigate([ROUTES.HOME]);
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
