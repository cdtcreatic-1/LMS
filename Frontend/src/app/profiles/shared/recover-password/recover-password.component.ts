import { NgClass, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { FlotingAlertComponent } from 'src/app/shared/floting-alert/floting-alert.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { AppState } from 'src/app/store/app.state';
import { selectErrorMessage } from 'src/app/store/selectors/global.selector';
import { ModalCongratulationComponent } from '../modal-congratulation/modal-congratulation.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RequestRecoverPassword } from '../interfaces';
import { SharedProfilesService } from '../services/shared-profiles.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
  standalone: true,
  imports: [
    NgIf,
    FlotingAlertComponent,
    ReactiveFormsModule,
    IonicModule,
    MatTooltipModule,
    NgClass,
    MatDialogModule,
  ],
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {
  token: string;
  verifiedToken: number = 1;
  isErrorAlert: boolean = false;
  message: string = '';

  showPasswordValues: {
    isShowNewPassword: boolean;
    isShowRepeatNewPassword: boolean;
  } = {
    isShowNewPassword: false,
    isShowRepeatNewPassword: false,
  };

  isShowPassword: boolean = false;

  formRecoverPassword: FormGroup = this.fb.group({
    newPassword: [''],
    repeatNewPassword: [''],
  });

  suscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    private store: Store<AppState>,
    private sharedProfiles: SharedProfilesService,
    private matDialog: MatDialog
  ) {
    const token = this.route.snapshot.paramMap.get('token');
    this.token = token ? token : '';
  }

  ngOnInit() {
    const suscription1 = this.sharedService
      .getVerifyToken(this.token)
      .subscribe((res) => {
        if (!res) {
          this.verifiedToken = 2;
          return;
        }
        if (typeof res !== 'number') {
          this.verifiedToken = 3;
        }
      });

    this.suscription.add(suscription1);

    const suscription2 = this.store
      .select(selectErrorMessage)
      .subscribe((data) => {
        this.isErrorAlert = data.isError;
        this.message = data.message;
      });

    this.suscription.add(suscription2);
  }

  handleClickHome() {
    this.router.navigate(['home']);
  }

  validatorFields(field: string) {
    return (
      this.formRecoverPassword.controls[field].errors &&
      this.formRecoverPassword.controls[field].touched
    );
  }

  showPassword(index: number) {
    if (index === 1) {
      this.showPasswordValues.isShowNewPassword =
        !this.showPasswordValues.isShowNewPassword;
    } else {
      this.showPasswordValues.isShowRepeatNewPassword =
        !this.showPasswordValues.isShowRepeatNewPassword;
    }
  }

  handleSubmit() {
    if (this.formRecoverPassword.invalid) {
      this.formRecoverPassword.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completar todos los campos' })
      );
      return;
    }

    if (
      this.formRecoverPassword.value.newPassword !==
      this.formRecoverPassword.value.repeatNewPassword
    ) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'Las contraseñas no coinciden' })
      );
      return;
    }

    const dataRecoverPassword: RequestRecoverPassword = {
      newPassword: this.formRecoverPassword.value.newPassword,
      repeatNewPassword: this.formRecoverPassword.value.newPassword,
    };

    const suscription3 = this.sharedProfiles
      .setChangePassword(dataRecoverPassword, this.token)
      .subscribe((res) => {
        if (res) {
          this.matDialog.open(ModalCongratulationComponent);
        }
      });
    this.suscription.add(suscription3);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
