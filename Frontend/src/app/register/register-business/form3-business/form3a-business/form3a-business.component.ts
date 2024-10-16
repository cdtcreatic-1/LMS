import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RegisterService } from 'src/app/register/shared/services/register.service';
import { Form3BusinessService } from '../service/form3-business.service';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { changeCurrentWindow } from 'src/app/store/actions/current-window.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { PointsForm3BusinessComponent } from '../points-form3-business/points-form3-business.component';
import { ErrorsFormsComponent } from '../../../../shared/errors-forms/errors-forms.component';
import { NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { TitleComponent } from 'src/app/register/shared/title/title.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-form3a-business',
  templateUrl: './form3a-business.component.html',
  styleUrls: ['./form3a-business.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    ErrorsFormsComponent,
    PointsForm3BusinessComponent,
    MatTooltipModule,
    NgClass,
    TitleComponent,
    RouterLink,
  ],
})
export class Form3aBusinessComponent implements OnDestroy {
  form3A: FormGroup = this.fb.group({
    histoyText: [''],
  });

  isErrorLoadTextAudio: boolean = false;

  suscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private grservice: GlobalRegisterService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  validatorFields(field: string) {
    return (
      this.form3A.controls[field].errors && this.form3A.controls[field].touched
    );
  }

  comeBack() {
    this.store.dispatch(changeCurrentWindow({ value: 3 }));
  }

  next() {
    if (this.form3A.invalid) {
      this.form3A.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completar todos los campos' })
      );
      return;
    }

    const suscruption1 = this.grservice
      .LoadTextInformation(this.form3A.controls.histoyText.value, 2)
      .subscribe((res) => {
        this.isErrorLoadTextAudio = res;
        if (!res) return;
        //this.router.navigate(['register/businessman/farm-history/2']);
      });

    this.suscription.add(suscruption1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
