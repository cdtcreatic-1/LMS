import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setActualIdRegisterLot } from 'src/app/store/actions/user-menu.actions';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { setReviewCoffee } from 'src/app/store/actions/add-lots.actions';
import { FormReviewCoffee } from '../interfaces';
import { selectAddLots } from 'src/app/store/selectors/global.selector';
import { NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-review-coffee',
  templateUrl: './review-coffee.component.html',
  styleUrls: ['./review-coffee.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatTooltipModule],
})
export class ReviewCoffeeComponent implements OnInit {
  formReview: FormGroup = this.fb.group({
    histoyGermination: '',
    histoySecado: [''],
    histoySembrado: [''],
    historyTostado: [''],
    historyRecoleccion: [''],
    histoyEmpaquetado: [''],
  });

  isErrorLoadTextAudio: boolean = false;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(selectAddLots).subscribe((data) => {
      if (data.formReviewCoffee) {
        const {
          germination_summary,
          drying_summary,
          harvest_summary,
          roasting_summary,
          sown_summary,
          packaging_summary,
        } = data.formReviewCoffee;

        this.formReview.get('histoyGermination')?.setValue(germination_summary);
        this.formReview.get('histoySecado')?.setValue(drying_summary);
        this.formReview.get('histoySembrado')?.setValue(sown_summary);
        this.formReview.get('historyTostado')?.setValue(roasting_summary);
        this.formReview.get('historyRecoleccion')?.setValue(harvest_summary);
        this.formReview.get('histoyEmpaquetado')?.setValue(packaging_summary);
      }
    });
  }

  validatorFields(field: string) {
    return (
      this.formReview.controls[field].errors &&
      this.formReview.controls[field].touched
    );
  }

  comeBack() {
    this.store.dispatch(setActualIdRegisterLot({ actualId: 2.2 }));
  }

  next() {
    if (this.formReview.invalid) {
      this.formReview.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, complete todo los campos' })
      );
      return;
    }

    const body: FormReviewCoffee = {
      id_lot: NaN,
      germination_summary: this.formReview.controls.histoyGermination.value,
      drying_summary: this.formReview.controls.histoySecado.value,
      harvest_summary: this.formReview.controls.historyRecoleccion.value,
      packaging_summary: this.formReview.controls.histoyEmpaquetado.value,
      roasting_summary: this.formReview.controls.historyTostado.value,
      sown_summary: this.formReview.controls.histoySembrado.value,
    };

    this.store.dispatch(setReviewCoffee({ form: body }));
    this.store.dispatch(setActualIdRegisterLot({ actualId: 2.4 }));
  }
}
