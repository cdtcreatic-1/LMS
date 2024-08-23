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
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-form3c-business',
  templateUrl: './form3c-business.component.html',
  styleUrls: ['../form3a-business/form3a-business.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PointsForm3BusinessComponent,
    MatTooltipModule,
    NgClass,
    RouterLink,
  ],
})
export class Form3cBusinessComponent implements OnDestroy {
  form3C: FormGroup = this.fb.group({
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
      this.form3C.controls[field].errors && this.form3C.controls[field].touched
    );
  }

  comeBack() {
    this.store.dispatch(changeCurrentWindow({ value: 5 }));
  }

  next() {
    if (this.form3C.invalid) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completar todos los campos' })
      );
      this.form3C.markAllAsTouched();
      return;
    }

    const suscruption1 = this.grservice
      .LoadTextInformation(this.form3C.controls.histoyText.value, 4)
      .subscribe((res) => {
        this.isErrorLoadTextAudio = res;
        if (!res) return;
        this.router.navigate(['register/businessman/farm-history/4']);
      });

    this.suscription.add(suscruption1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
