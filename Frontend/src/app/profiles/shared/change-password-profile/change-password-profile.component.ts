import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { GlobalStorage } from 'src/app/shared/storage/global-storage';
import { NgClass, NgIf } from '@angular/common';
import { GlobalTitlesComponent } from 'src/app/shared/global-titles/global-titles.component';
import { GlobalSubtitlesComponent } from 'src/app/shared/global-subtitles/global-subtitles.component';
import { ErrorsFormsComponent } from 'src/app/shared/errors-forms/errors-forms.component';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { BodyFarmerService } from '../../farmer/services/body-farmer.service';
import { BodyBusinessmanService } from '../../businessman/body-businessman/services/body-businessman.service';

@Component({
  selector: 'app-change-password-profile',
  templateUrl: './change-password-profile.component.html',
  styleUrls: ['./change-password-profile.component.css'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    GlobalTitlesComponent,
    GlobalSubtitlesComponent,
    ReactiveFormsModule,
    ErrorsFormsComponent,
    GlobalButtonsComponent,
  ],
})
export class ChangePasswordProfileComponent {
  isValidation: boolean = false;
  formChangePassword: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
  });
  @Input() rol: number;

  isSendEmail: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bfarmer: BodyFarmerService,
    private bbusibessman: BodyBusinessmanService
  ) {
    this.rol = new GlobalStorage().setRolRegister();
  }

  changeEmail() {
    this.isValidation = false;
  }

  enviar() {
    // this.umservice
    //   .setSendCodeVerification(this.formChangePassword.get('email')?.value)
    //   .subscribe((res) => {
    //     if (!res) return;
    //     this.isSendEmail = true;
    //     // alert(
    //     //   `Se ha enviado un codigo de vereficación a ${
    //     //     this.formChangePassword.get('email')?.value
    //     //   }`
    //     // );
    //   });
    // if (this.formChangePassword.invalid) {
    //   this.isValidation = true;
    //   return;
    // }
    // if (this.rol === 1) {
    //   this.bfarmer.setBodyFarmer('FP4B');
    // } else if (this.rol === 2) {
    //   this.bbusibessman.setBodyBusinessman('BP4B');
    // }
  }
}
