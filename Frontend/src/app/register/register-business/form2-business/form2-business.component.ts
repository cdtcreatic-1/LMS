import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RegisterBusinessmanService } from '../services/register-businessman.service';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { GlobalRegisterService } from '../../services/register.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { CofeeProfiles, Roasting } from '../../register-farmer/interface';
import { Cities, States } from '../../register-farmer/interface';
import { MainRegisterLotsService } from 'src/app/profiles/farmer/body-farmer/add-lots/services/main-register-lots.serice.service';
import { TitleComponent } from '../../shared/title/title.component';
import { Router } from '@angular/router';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-form2-business',
  templateUrl: './form2-business.component.html',
  styleUrls: ['./form2-business.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    NgClass,
    NgIf,
    TitleComponent,
    MatTooltipModule,
  ],
})
export class Form2BusinessComponent implements OnDestroy {
  form2Business: FormGroup = this.fb.group({
    tazaProfile: [''],
    toston: [''],
    state: [''],
    city: [''],
  });

  tazaProfileOnly: string = '';

  dataProfileTaza: CofeeProfiles[] = [];
  dataTostion: Roasting[] = [];
  states: States[] = [];
  cities: Cities[] = [];

  reloadComponent: number = 0;
  numberLot: number;

  suscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private addLotsService: MainRegisterLotsService,
    private rbservice: RegisterBusinessmanService,
    private grservice: GlobalRegisterService,
    private router: Router
  ) {
    const suscruption1 = this.grservice.getStates('48').subscribe((index) => {
      this.states = index.states;
    });

    this.suscription.add(suscruption1);
  }

  ngOnInit(): void {
    const suscruption2 = this.addLotsService
      .getDataProfilesCoffee()
      .subscribe((data: any) => {
        this.dataProfileTaza = data.coffeeProfiles;
        this.dataTostion = data.roastingTypes;
      });

    this.suscription.add(suscruption2);

    this.onChangeFormA();
  }

  validatorFields(field: string) {
    return (
      this.form2Business.controls[field].errors &&
      this.form2Business.controls[field].touched
    );
  }

  onChangeFormA() {
    const suscruption3 = this.form2Business.valueChanges.subscribe((data) => {
      if (data.state) {
        this.cities = [];
        this.grservice.getCities(data.state).subscribe((dataCities) => {
          this.cities = dataCities;
        });
      }
    });

    this.suscription.add(suscruption3);
  }

  comeBack() {
    // this.store.dispatch(setChangeActualIdDasboard({ actualId: 2 }));
  }

  next() {
    if (this.form2Business.invalid) {
      this.form2Business.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completar todos los campos' })
      );
      return;
    }

    const bodyRequest = {
      id_user: NaN,
      id_profile: this.form2Business.get('tazaProfile')?.value,
      id_roast: this.form2Business.get('toston')?.value,
      id_state: this.form2Business.get('state')?.value,
      id_city: this.form2Business.get('city')?.value,
    };

    const suscruption4 = this.rbservice
      .setRegisterInterested(bodyRequest)
      .subscribe((res: boolean) => {
        if (!res) return;

        this.router.navigate(['register/businessman/farm-history/1']);
      });

    this.suscription.add(suscruption4);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
