import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RegisterService } from 'src/app/register/shared/services/register.service';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { changeCurrentWindow } from 'src/app/store/actions/current-window.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { PointsForm3BusinessComponent } from '../points-form3-business/points-form3-business.component';
import { Subscription } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-form3b-business',
  templateUrl: './form3b-business.component.html',
  styleUrls: ['../form3a-business/form3a-business.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PointsForm3BusinessComponent,
    MatTooltipModule,
    NgClass,
    RouterLink
  ],
})
export class Form3bBusinessComponent implements OnDestroy {
  form3B: FormGroup = this.fb.group({
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
      this.form3B.controls[field].errors && this.form3B.controls[field].touched
    );
  }

  comeBack() {
    this.store.dispatch(changeCurrentWindow({ value: 4 }));
  }

  next() {
    if (this.form3B.invalid) {
      this.form3B.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completar todos los campos' })
      );
      return;
    }

    const suscruption1 = this.grservice
      .LoadTextInformation(this.form3B.controls.histoyText.value, 3)
      .subscribe((res) => {
        this.isErrorLoadTextAudio = res;
        if (!res) return;
        this.router.navigate(['register/businessman/farm-history/3']);
      });

    this.suscription.add(suscruption1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
