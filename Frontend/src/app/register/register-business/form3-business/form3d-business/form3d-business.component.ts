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
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { changeCurrentWindow } from 'src/app/store/actions/current-window.actions';
import { RegisterBusinessmanService } from '../../services/register-businessman.service';
import { PointsForm3BusinessComponent } from '../points-form3-business/points-form3-business.component';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from 'src/app/shared/constants';

@Component({
  selector: 'app-form3d-business',
  templateUrl: './form3d-business.component.html',
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
export class Form3dBusinessComponent implements OnDestroy {
  form3D: FormGroup = this.fb.group({
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
      this.form3D.controls[field].errors && this.form3D.controls[field].touched
    );
  }

  comeBack() {
    this.store.dispatch(changeCurrentWindow({ value: 7 }));
  }

  next() {
    if (this.form3D.invalid) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completar todos los campos' })
      );
      this.form3D.markAllAsTouched();
      return;
    }

    const suscruption1 = this.grservice
      .LoadTextInformation(this.form3D.controls.histoyText.value, 5, 7)
      .subscribe((res) => {
        this.isErrorLoadTextAudio = res;
        if (!res) return;
        this.router.navigate([ROUTES.WELCOME_BUSINESSMAN]);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });

    this.suscription.add(suscruption1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
