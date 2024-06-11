import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { RegisterBusinessmanService } from 'src/app/register/register-business/services/register-businessman.service';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { RegisterService } from 'src/app/register/shared/services/register.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { AppState } from 'src/app/store/app.state';
import { selectDataShared } from 'src/app/store/selectors/global.selector';
import { GlobalButtonsComponent } from '../../../../shared/global-buttons/global-buttons.component';
import { ErrorsFormsComponent } from '../../../../shared/errors-forms/errors-forms.component';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { GlobalTitlesComponent } from '../../../../shared/global-titles/global-titles.component';
import { Countries, States } from 'src/app/register/register-farmer/interface';
import { Subscription } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { handleKeyDown } from 'src/app/shared/helpers';

@Component({
  selector: 'app-edit-profile-businessman',
  templateUrl: './edit-profile-businessman.component.html',
  styleUrls: ['./edit-profile-businessman.component.css'],
  standalone: true,
  imports: [
    GlobalTitlesComponent,
    ReactiveFormsModule,
    NgIf,
    ErrorsFormsComponent,
    NgFor,
    GlobalButtonsComponent,
    MatTooltipModule,
    NgClass,
  ],
})
export class EditProfileBusinessmanComponent implements OnInit, OnDestroy {
  form1Business: FormGroup = this.fb.group({
    allName: [''],
    phone: [''],
    mail: [''],
    userName: [''],
    postalCode: [''],
    identification: [''],
    country: [''],
    state: [''],
  });

  dataRol = ['Caficultor', 'Comprador', 'Aprendiz'];

  countries: Countries[] = [];
  states: States[] = [];

  pathPhoto: string | null = '';

  dataImage: any = undefined;
  image: any = undefined;
  id_user: number = NaN;

  suscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private grservice: GlobalRegisterService,
    private sharedService: SharedService
  ) {
    const suscription = this.grservice.getCountries().subscribe((countries) => {
      this.countries = countries;
    });

    this.suscription.add(suscription);
  }

  ngOnInit(): void {
    const suscription1 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        if (data.dataUserRegister) {
          this.grservice
            .getStates(data.dataUserRegister.id_country.toString())
            .subscribe((states) => {
              this.states = states.states;
            });

          this.pathPhoto = data.dataUserRegister.user_profile_photo;
          this.id_user = data.dataUserRegister.id_user;
          this.form1Business
            .get('allName')
            ?.setValue(data.dataUserRegister.user_name);
          this.form1Business
            .get('phone')
            ?.setValue(data.dataUserRegister.user_phone);
          this.form1Business
            .get('mail')
            ?.setValue(data.dataUserRegister.user_email);
          this.form1Business
            .get('userName')
            ?.setValue(data.dataUserRegister.user_username);
          this.form1Business
            .get('identification')
            ?.setValue(data.dataUserRegister.number_document);
          this.form1Business
            .get('postalCode')
            ?.setValue(data.dataUserRegister.postal_code);
          this.form1Business
            .get('country')
            ?.setValue(data.dataUserRegister.id_country);
          this.image = data.dataUserRegister.user_profile_photo;

          this.grservice
            .getStates(data.dataUserRegister.id_country.toString())
            .subscribe((data) => {
              this.states = data.states;
            });
          this.form1Business
            .get('state')
            ?.setValue(data.dataUserRegister.id_state);
        }
      });

    this.suscription.add(suscription1);

    this.onChangeFormA();
  }

  validatorFields(field: string) {
    return (
      this.form1Business.controls[field].errors &&
      this.form1Business.controls[field].touched
    );
  }

  onChangeFormA() {
    let dataReft: string = 'none';
    this.form1Business.valueChanges.subscribe((data) => {
      if (data.country) {
        if (dataReft !== data.country) {
          dataReft = data.country;

          const suscription2 = this.grservice
            .getStates(data.country)
            .subscribe((data) => {
              this.states = data.states;
            });

          this.suscription.add(suscription2);
        }
      }
    });
  }

  handleKeyDown(e: any) {
    handleKeyDown(e);
  }

  onChangeLoadImage(event: any) {
    if (event.target.files[0].size > 3000000) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'La imagen cargada pesa más de 3Mb' })
      );
      return;
    }

    if (
      event.target.files[0].type === 'image/png' ||
      event.target.files[0].type === 'image/jpeg'
    ) {
      const dataImage = event.target.files[0];
      this.dataImage = dataImage;

      const reader = new FileReader();

      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.image = reader.result as string;
        };
      }
    } else {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Formato no permitido,por favor cargue una imagen',
        })
      );
    }
  }

  next() {
    if (this.form1Business.invalid) {
      this.form1Business.markAllAsTouched();
      return;
    }

    let formdata: FormData = new FormData();

    formdata.append('id_user', this.id_user.toString());
    formdata.append('user_name', this.form1Business.get('allName')?.value);
    formdata.append('user_phone', this.form1Business.get('phone')?.value);
    formdata.append('user_email', this.form1Business.get('mail')?.value);
    formdata.append('user_username', this.form1Business.get('userName')?.value);
    formdata.append('postal_code', this.form1Business.get('postalCode')?.value);
    formdata.append('id_type_document', '1');
    formdata.append(
      'number_document',
      this.form1Business.get('identification')?.value
    );
    formdata.append('id_state', this.form1Business.get('state')?.value);
    formdata.append('user_gender', '1');

    if (this.dataImage) {
      formdata.append(
        'user_profile_photo',
        this.dataImage,
        this.dataImage.name
      );
    }

    const suscription3 = this.grservice
      .setRegiterPUT(formdata)
      .subscribe((index) => {
        if (!index) return;
        this.sharedService.getDataRegister();
        this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
      });

    this.suscription.add(suscription3);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
