import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GlobalRegisterService } from '../../services/register.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { changeCurrentWindow } from 'src/app/store/actions/current-window.actions';
import { ErrorsFormsComponent } from '../../../shared/errors-forms/errors-forms.component';
import { NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { TitleComponent } from '../../shared/title/title.component';

@Component({
  selector: 'app-form-review',
  templateUrl: './form-review.component.html',
  styleUrls: ['./form-review.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    ErrorsFormsComponent,
    NgClass,
    MatTooltipModule,
    TitleComponent,
    RouterLink,
  ],
})
export class FormReviewComponent implements OnDestroy {
  form2: FormGroup = this.fb.group({
    histoyText: [''],
  });

  isErrorLoadTextAudio: boolean = false;

  suscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private grservice: GlobalRegisterService,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.store.dispatch(changeCurrentWindow({ value: 13 }));
  }

  validatorFields(field: string) {
    return (
      this.form2.controls[field].errors && this.form2.controls[field].touched
    );
  }

  next() {
    if (this.form2.invalid) {
      this.form2.markAllAsTouched();
      return;
    }

    const suscription1 = this.grservice
      .LoadTextInformationFarmer(this.form2.controls.histoyText.value, 1)
      .subscribe((res) => {
        this.isErrorLoadTextAudio = res;
        if (!res) {
          this.store.dispatch(
            setIsErrorMessage({
              message: 'Error al cargar los datos, intentelo más tarde',
            })
          );
          return;
        }
        this.grservice.getDataRegisterFarm();
        this.router.navigate(['register/farmer/user-created']);
        // this.store.dispatch(changeCurrentWindow({ value: 14 }));
      });

    this.suscription.add(suscription1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
