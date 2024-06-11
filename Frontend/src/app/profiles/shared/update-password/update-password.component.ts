import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RequestChangePassword } from 'src/app/shared/interfaces';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { AppState } from 'src/app/store/app.state';
import { NgClass, NgIf } from '@angular/common';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    ReactiveFormsModule,
    GlobalButtonsComponent,
    MatTooltipModule,
  ],
})
export class UpdatePasswordComponent {
  isValidation: boolean = false;
  formUpdatePassword: FormGroup = this.fb.group({
    oldPassword: [''],
    newPassword: [''],
    repeatPassword: [''],
  });

  @Input() rol: number;

  isError: boolean = false;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private vs: ValidatorService,
    private sharedService: SharedService,
    private store: Store<AppState>
  ) {}

  changeEmail() {
    this.isValidation = false;
  }

  validatorFields(field: string) {
    return (
      this.formUpdatePassword.controls[field].errors &&
      this.formUpdatePassword.controls[field].touched
    );
  }

  enviar() {
    if (this.formUpdatePassword.invalid) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completa todos los campos' })
      );
      this.formUpdatePassword.markAllAsTouched();
      return;
    }

    if (
      this.formUpdatePassword.get('newPassword')?.value !==
      this.formUpdatePassword.get('repeatPassword')?.value
    ) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'Las nuevas contraseñas no coinciden' })
      );
      return;
    }

    const body: RequestChangePassword = {
      id_user: localStorage.getItem('@userId')!,
      old_password: this.formUpdatePassword.get('oldPassword')?.value,
      new_password: this.formUpdatePassword.get('newPassword')?.value,
      confirm_password: this.formUpdatePassword.get('repeatPassword')?.value,
    };

    this.sharedService.getChangePassword(body).subscribe((response) => {
      if (!response) {
        return;
      }
      this.message = 'Contraseña cambiada exitosamente';
    });
  }
}
