import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { RegisterService } from 'src/app/register/shared/services/register.service';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { AppState } from 'src/app/store/app.state';
import { NgClass, NgIf } from '@angular/common';
import { ErrorsFormsComponent } from 'src/app/shared/errors-forms/errors-forms.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-review-famr',
  templateUrl: './review-famr.component.html',
  styleUrls: [
    '../../../../../register/register-farmer/form-review/form-review.component.css',
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    ErrorsFormsComponent,
    NgClass,
    MatTooltipModule,
  ],
})
export class ReviewFamrComponent {
  form2: FormGroup = this.fb.group({
    histoyText: ['', [Validators.required]],
  });

  isErrorLoadTextAudio: boolean = false;

  constructor(
    private fb: FormBuilder,
    private rservice: RegisterService,
    private grservice: GlobalRegisterService,
    private store: Store<AppState>
  ) {}

  validatorFields(field: string) {
    return (
      this.form2.controls[field].errors && this.form2.controls[field].touched
    );
  }

  comeBack() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 1.11 }));
  }

  next() {
    if (this.form2.invalid) {
      this.form2.markAllAsTouched();
      return;
    }

    this.grservice
      .LoadTextInformationDashboard(this.form2.controls.histoyText.value, 1)
      .subscribe((res) => {
        this.isErrorLoadTextAudio = res;
        if (res) return;
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 1.13 }));
      });
  }
}
