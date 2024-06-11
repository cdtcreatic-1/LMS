import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { GlobalButtonsComponent } from '../../shared/global-buttons/global-buttons.component';
import { GlobalSubtitlesComponent } from '../../shared/global-subtitles/global-subtitles.component';
import { GlobalTitlesComponent } from '../../shared/global-titles/global-titles.component';
import { NgStyle, NgIf, NgClass } from '@angular/common';
import { ErrorsFormsComponent } from 'src/app/shared/errors-forms/errors-forms.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-modal-forgot-password',
  templateUrl: './modal-forgot-password.component.html',
  styleUrls: ['./modal-forgot-password.component.css'],
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    GlobalTitlesComponent,
    GlobalSubtitlesComponent,
    ReactiveFormsModule,
    NgClass,
    GlobalButtonsComponent,
    ErrorsFormsComponent,
    MatTooltipModule,
  ],
})
export class ModalForgotPasswordComponent implements OnInit, OnDestroy {
  formChangePassword: FormGroup = this.fb.group({
    email: [null, [Validators.email]],
  });

  isEmailSent: boolean = false;
  isErrorSendMail: boolean = false;

  suscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.onChangeForm();
  }

  validatorFields(field: string) {
    return (
      this.formChangePassword.controls[field].errors &&
      this.formChangePassword.controls[field].touched
    );
  }

  onChangeForm() {
    const suscription = this.formChangePassword
      .get('email')
      ?.valueChanges.subscribe((res) => {
        this.isErrorSendMail = false;
      });

    this.suscription.add(suscription);
  }

  enviar() {
    this.isErrorSendMail = false;
    if (this.formChangePassword.invalid) {
      this.formChangePassword.markAllAsTouched();
      return;
    }

    const suscruption1 = this.sharedService
      .setSendCodeVerification(this.formChangePassword.get('email')?.value)
      .subscribe((res) => {
        if (!res) {
          this.isErrorSendMail = true;
          return;
        }
        this.isEmailSent = true;
      });

    this.suscription.add(suscruption1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
