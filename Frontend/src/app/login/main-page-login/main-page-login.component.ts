import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { APIKEY_RECAPCHA, ROUTES } from 'src/app/shared/constants';
import { LoginService } from '../services/login.service';
import { Observable, Subscription } from 'rxjs';
import { initialStateLogin } from '../interfaces';
import {
  selectErrorMessage,
  selectLoading,
} from 'src/app/store/selectors/global.selector';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { RecaptchaErrorParameters, RecaptchaModule } from 'ng-recaptcha';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalForgotPasswordComponent } from '../modal-forgot-password/modal-forgot-password.component';
import { IonicModule } from '@ionic/angular';
import { FlotingAlertComponent } from '../../shared/floting-alert/floting-alert.component';
import { NgClass, NgIf } from '@angular/common';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { ProtectedRouteAdminLogin } from 'src/app/shared/helpers';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-main-page-login',
  templateUrl: './main-page-login.component.html',
  styleUrls: ['./main-page-login.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    ReactiveFormsModule,
    IonicModule,
    RecaptchaModule,
    MatDialogModule,
    FlotingAlertComponent,
    LoadingComponent,
    NgClass,
    MatTooltipModule,
  ],
})
export class MainPageLoginComponent implements OnDestroy {
  responseLoginObs$: Observable<initialStateLogin>;
  responseLogin: initialStateLogin = {
    isErrorLogin: false,
    rolId: undefined,
    userId: undefined,
    code: '',
    currentWindow: undefined,
  };

  formLogin: FormGroup = this.fb.group({
    email: ['', [Validators.email]],
    password: [''],
  });

  isLoading: boolean = false;
  isShowPassword: boolean = false;
  isCheckRepapcha: boolean = false;

  isErrorAlert: boolean = false;
  message: string = '';

  apiKey: string = '';

  suscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private lservice: LoginService,
    private store: Store<AppState>,
    private matDialog: MatDialog
  ) {
    // ProtectedRouteAdminLogin(this.router);

    this.apiKey = APIKEY_RECAPCHA;

    const suscruption1 = this.store
      .select(selectErrorMessage)
      .subscribe((data) => {
        this.isErrorAlert = data.isError;
        this.message = data.message;
      });

    this.suscription.add(suscruption1);

    const suscription2 = this.store.select(selectLoading).subscribe((data) => {
      this.isLoading = data.isLoading;
    });

    this.suscription.add(suscription2);
  }

  home() {
    this.router.navigate([ROUTES.HOME]);
  }

  register() {
    this.router.navigate([ROUTES.REGISTER + '/profiles']);
  }

  validatorFields(field: string) {
    return (
      this.formLogin.controls[field].errors &&
      this.formLogin.controls[field].touched
    );
  }

  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  public resolved(captchaResponse: string): void {
    this.isCheckRepapcha = true;
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    this.isCheckRepapcha = false;
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }

  forgotPassword() {
    this.matDialog.open(ModalForgotPasswordComponent);
  }

  iniciarSesion() {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({ message: 'por favor, completa todos los campos' })
      );
      return;
    }

    // if (!this.isCheckRepapcha) {
    //   this.store.dispatch(
    //     setIsErrorMessage({ message: 'por favor, completa todos los campos' })
    //   );
    //   return;
    // }

    const body = {
      email: this.formLogin.controls.email.value,
      password: this.formLogin.controls.password.value,
    };

    const suscruption2 = this.lservice.setLogin(body).subscribe((index) => {
      this.responseLogin = index;
      if (index.isErrorLogin) {
        this.store.dispatch(
          setIsErrorMessage({ message: 'Usuario o contraseña incorrectos' })
        );
        return;
      }

      if (index.rolId === 1 && index.currentWindow === 10) {
        this.router.navigate([ROUTES.USER_FARMER]);
        return;
      } else if (index.rolId === 2 && index.currentWindow === 10) {
        this.router.navigate([ROUTES.USER_BUSINESSMAN]);
        return;
      } else if (index.rolId === 3) {
        this.router.navigate([ROUTES.USER_APPRENTICE]);
      } else if (index.rolId === 4) {
        this.router.navigate([ROUTES.ADMIN_PROFILE]);
      } else {
        if (index.rolId == 1) {
          this.router.navigate([ROUTES.REGISTER + '/farmer/locate-farm']);
        } else {
          this.router.navigate([ROUTES.REGISTER + '/businessman/preferences']);
        }
      }
    });

    this.suscription.add(suscruption2);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
