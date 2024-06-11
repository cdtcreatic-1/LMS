import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DataCurrentWindow } from 'src/app/register/interfaces';
import { Subscription, min } from 'rxjs';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { changeCurrentWindow } from 'src/app/store/actions/current-window.actions';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { MainRegisterLotsService } from '../services/main-register-lots.serice.service';
import {
  selectAddLots,
  selectDataCurrentWindow,
  selectDataUser,
} from 'src/app/store/selectors/global.selector';
import { setActualIdRegisterLot } from 'src/app/store/actions/user-menu.actions';
import { Asociation } from '../type-cofee/interfaces';
import { ResponseReconmendationPrice } from 'src/app/profiles/farmer/interfaces';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { setPriceCoffee } from 'src/app/store/actions/add-lots.actions';
import { FormPriceCoffee } from '../interfaces';
import { NgClass, NgFor } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-price-coffee',
  templateUrl: './price-coffee.component.html',
  styleUrls: ['./price-coffee.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor, MatTooltipModule],
})
export class PriceCoffeeComponent implements OnInit, OnDestroy {
  formPriceCoffee: FormGroup;

  currentDataWindow: DataCurrentWindow;
  suscription = new Subscription();
  tazaProfileOnly: string = '';

  dataAsociation: Asociation[] = [];
  reloadComponent: number = 0;

  dataPrice?: ResponseReconmendationPrice = undefined;
  messageValuePrice: string;

  constructor(
    private fb: FormBuilder,
    private addLotsService: MainRegisterLotsService,
    private store: Store<AppState>
  ) {
    this.suscription = this.store.select(selectDataUser).subscribe((data) => {
      this.dataPrice = data.dataPriceRecomendation;
      this.messageValuePrice = `El valor mínimo del café es de $${this.dataPrice
        ?.lower_price!} y máximo de $${this.dataPrice?.higher_price!}`;
    });
  }

  ngOnInit(): void {
    this.formPriceCoffee = this.fb.group({
      price: [this.dataPrice?.recommended_price!],
      asociation: [''],
      kilos: [''],
      kilosSample: [''],
    });

    this.addLotsService.getDataProfilesCoffee().subscribe((index: any) => {
      this.dataAsociation = index.associations;
    });

    this.suscription = this.store
      .select(selectDataCurrentWindow)
      .subscribe((data) => {
        this.currentDataWindow = data.dataCurrentWindow!;
      });

    this.suscription = this.store.select(selectAddLots).subscribe((data) => {
      this.tazaProfileOnly = data.profileTazaName;
      if (data.formPriceCoffee) {
        const {
          price_per_kilo,
          id_association,
          total_quantity,
          samples_quantity,
        } = data.formPriceCoffee;
        this.formPriceCoffee.get('price')?.setValue(price_per_kilo);
        this.formPriceCoffee.get('asociation')?.setValue(id_association);
        this.formPriceCoffee.get('kilos')?.setValue(total_quantity);
        this.formPriceCoffee.get('kilosSample')?.setValue(samples_quantity);
      }
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
  

  validatorFields(field: string) {
    return (
      this.formPriceCoffee.controls[field].errors &&
      this.formPriceCoffee.controls[field].touched
    );
  }

  comeBack() {
    this.store.dispatch(setActualIdRegisterLot({ actualId: 2.1 }));
  }

  next() {
    if (this.formPriceCoffee.invalid) {
      this.formPriceCoffee.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, complete todos lo campos' })
      );
      return;
    }

    const bodyRequest: FormPriceCoffee = {
      id_lot: NaN,
      total_quantity: this.formPriceCoffee.controls.kilos.value,
      samples_quantity: this.formPriceCoffee.controls.kilosSample.value,
      id_association: this.formPriceCoffee.controls.asociation.value,
      price_per_kilo: this.formPriceCoffee.controls.price.value,
    };

    this.store.dispatch(setPriceCoffee({ form: bodyRequest }));
    this.store.dispatch(setActualIdRegisterLot({ actualId: 2.3 }));
  }
}
