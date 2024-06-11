import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  Asociation,
  CofeeProfiles,
  CoffeeVariety,
  Lots,
  Roasting,
} from './interfaces';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { DataCurrentWindow } from 'src/app/register/interfaces';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import {
  setActualIdRegisterLot,
  setChangeActualIdDasboard,
} from 'src/app/store/actions/user-menu.actions';
import {
  selectAddLots,
  selectDataCurrentWindow,
  selectDataUser,
} from 'src/app/store/selectors/global.selector';
import { BodyFarmerService } from '../../../services/body-farmer.service';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import {
  clearStateAddLots,
  setProfileTaza,
  setTypeCoffee,
} from 'src/app/store/actions/add-lots.actions';
import { MainRegisterLotsService } from '../services/main-register-lots.serice.service';
import { FormTypeCoffee } from '../interfaces';
import { NgClass, NgFor } from '@angular/common';
import { setIsLoading } from 'src/app/store/actions/loading.actions';

@Component({
  selector: 'app-type-coffee',
  templateUrl: './type-coffee.component.html',
  styleUrls: ['./type-coffee.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor],
})
export class TypeCoffeeComponent implements OnInit {
  form3: FormGroup = this.fb.group({
    lot: ['', [Validators.required]],
    tazaProfile: ['', [Validators.required]],
    coffeeVariety: ['', [Validators.required]],
    toston: ['', [Validators.required]],
  });

  lots: Lots[] = [];
  currentDataWindow: DataCurrentWindow;
  suscription: Subscription;
  tazaProfileOnly: string = '';
  idFarmSelected: number = NaN;

  dataAsociation: Asociation[] = [];
  dataProfileTaza: CofeeProfiles[] = [];
  dataCoffeVariety: CoffeeVariety[] = [];
  dataTostion: Roasting[] = [];

  reloadComponent: number = 0;
  numberLot: number;

  constructor(
    private fb: FormBuilder,
    private addLotsService: MainRegisterLotsService,
    private store: Store<AppState>,
    private bfservice: BodyFarmerService
  ) {}

  ngOnInit(): void {
    this.onChangeFormA();

    // this.getUpdateCurrentWindowData();

    this.addLotsService.getDataProfilesCoffee().subscribe((index: any) => {
      this.dataAsociation = index.associations;
      this.dataProfileTaza = index.coffeeProfiles;
      this.dataTostion = index.roastingTypes;
      this.dataCoffeVariety = index.coffeeVariations;
    });

    this.suscription = this.store
      .select(selectDataCurrentWindow)
      .subscribe((data) => {
        this.currentDataWindow = data.dataCurrentWindow!;
      });

    this.suscription = this.store.select(selectDataUser).subscribe((data) => {
      this.numberLot = data.dataLotsByFarm.length + 1;
      this.form3.get('lot')?.setValue(data.dataLotsByFarm.length + 1);
      this.idFarmSelected = data.farmSelected?.id_farm!;
    });

    this.suscription = this.store.select(selectAddLots).subscribe((data) => {
      if (data.formTypeCoffee) {
        this.form3.get('tazaProfile')?.setValue(data.formTypeCoffee.id_profile);
        this.form3
          .get('coffeeVariety')
          ?.setValue(data.formTypeCoffee.id_variety);
        this.form3.get('toston')?.setValue(data.formTypeCoffee.id_roast);
      }
    });
  }

  onChangeFormA() {
    this.form3.valueChanges.subscribe((data) => {
      const res = this.dataProfileTaza.filter(
        (item) => item.id_profile === parseInt(data.tazaProfile)
      );
      if (res.length > 0) {
        this.tazaProfileOnly = res[0].profile_name;
      }
    });
  }

  validatorFields(field: string) {
    return (
      this.form3.controls[field].errors && this.form3.controls[field].touched
    );
  }

  comeBack() {
    this.store.dispatch(clearStateAddLots());
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 2 }));
  }

  next() {
    if (this.form3.invalid) {
      this.form3.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor complete todos los campos',
        })
      );
      return;
    }

    this.store.dispatch(setIsLoading({ value: true }));

    const bodyRequest: FormTypeCoffee = {
      id_farm: this.idFarmSelected,
      lot_number: this.numberLot,
      id_variety: this.form3.get('coffeeVariety')?.value,
      id_profile: this.form3.get('tazaProfile')?.value,
      id_roast: this.form3.get('toston')?.value,
    };

    this.store.dispatch(setTypeCoffee({ form: bodyRequest }));

    // // Delete this line when the service recomendation price is ok
    // this.store.dispatch(setActualIdRegisterLot({ actualId: 2.2 }));

    this.bfservice
      .getRegisterPriceRecomendation({
        variety_name: this.tazaProfileOnly,
      })
      .subscribe((res) => {
        this.store.dispatch(setIsLoading({ value: false }));
        if (!res) return;
        this.store.dispatch(setProfileTaza({ name: this.tazaProfileOnly }));
        this.store.dispatch(setActualIdRegisterLot({ actualId: 2.2 }));
      });
  }
}
