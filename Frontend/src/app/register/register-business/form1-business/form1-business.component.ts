import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { APIKEY_RECAPCHA, ROUTES } from 'src/app/shared/constants';
import { GlobalRegisterService } from '../../services/register.service';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { RecaptchaModule } from 'ng-recaptcha';
import { IonicModule } from '@ionic/angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Subscription } from 'rxjs';
import { Countries, States } from '../../register-farmer/interface';
import { TitleComponent } from '../../shared/title/title.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalSendMailComponent } from '../../shared/modal-send-mail/modal-send-mail.component';
import { setEmailVerification } from 'src/app/store/actions/current-window.actions';
import { selectDataShared } from 'src/app/store/selectors/global.selector';
import { DataUserRegister } from 'src/app/shared/interfaces';
import { handleKeyDown } from 'src/app/shared/helpers';

@Component({
  selector: 'app-form1-business',
  templateUrl: './form1-business.component.html',
  styleUrls: ['./form1-business.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgStyle,
    NgFor,
    MatTooltipModule,
    NgIf,
    IonicModule,
    RecaptchaModule,
    TitleComponent,
    MatDialogModule,
    RouterLink,
  ],
})
export class Form1BusinessComponent implements OnInit {
  form1Business: FormGroup = this.fb.group({
    allName: [''],
    phone: [''],
    mail: ['', Validators.email],
    userName: [''],
    postalCode: [''],
    identification: [''],
    country: [''],
    state: [''],
    password: [''],
    confirmPassword: [''],
  });

  countries: Countries[] = [];
  states: States[] = [];

  dataImage: any;
  image: any;
  typeIdentification: { id: number; name: string }[] = [
    { id: 1, name: 'Cédula de ciudadanía' },
    { id: 2, name: 'Cédula de extranjería' },
    { id: 3, name: 'Pasaporte' },
    { id: 4, name: 'Tarjeta de identidad' },
  ];

  isErrorRegister: boolean = false;
  isShowPassword = signal<boolean>(false);
  isShowRepeatPassword: boolean = false;
  isCheckRepapcha: boolean = false;

  apikey: string = '';

  dataUser: DataUserRegister;

  actualIdRole: number = NaN;

  private suscription: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private grservice: GlobalRegisterService,
    private store: Store<AppState>,
    private matDialog: MatDialog
  ) {
    this.apikey = APIKEY_RECAPCHA;

    const suscruption1 = this.grservice
      .getCountries()
      .subscribe((countries) => {
        this.countries = countries;
      });

    this.suscription.push(suscruption1);
  }

  ngOnInit(): void {
    this.onChangeFormA();

    const suscription = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        if (!data.dataUserRegister) {
          this.router.navigate(['register/businessman']);
          return;
        }
        this.actualIdRole = data.actualIdRole;
        this.dataUser = data.dataUserRegister;

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
      });

    this.suscription.push(suscription);
  }

  validatorFields(field: string) {
    return (
      this.form1Business.controls[field].errors &&
      this.form1Business.controls[field].touched
    );
  }

  onChangeFormA() {
    const suscruption2 = this.form1Business.valueChanges.subscribe(
      (data) => (this.isErrorRegister = false)
    );

    this.suscription.push(suscruption2);

    let dataReft: string = 'none';
    const suscruption3 = this.form1Business.valueChanges.subscribe((data) => {
      if (data.country) {
        if (dataReft !== data.country) {
          dataReft = data.country;

          this.states = [];

          this.grservice.getStates(data.country).subscribe((data) => {
            this.states = data.states;
          });
        }
      }
    });

    this.suscription.push(suscruption3);
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
          message: 'Formato no permitido, por favor cargue una imagen',
        })
      );
    }
  }

  comeBack() {
    if (!this.dataUser) {
      this.router.navigate([ROUTES.REGISTER + '/profiles']);
    } else {
      if (this.actualIdRole === 1) {
        this.router.navigate([ROUTES.USER_FARMER]);
      } else {
        this.router.navigate([ROUTES.USER_APPRENTICE]);
      }
    }
  }

  showPassword(id: number) {
    if (id === 1) {
      this.isShowPassword.set(!this.isShowPassword());
    } else {
      this.isShowRepeatPassword = !this.isShowRepeatPassword;
    }
  }

  resolved() {
    this.isCheckRepapcha = true;
  }

  onError() {
    this.isCheckRepapcha = false;
  }

  next() {
    if (!this.dataUser) {
      this.submitRegister();
    } else {
      this.submitAddProfile();
    }
  }

  submitRegister() {
    if (this.form1Business.invalid) {
      this.form1Business.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completar todos los campos' })
      );
      return;
    }

    if (!this.isCheckRepapcha) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completar todos los campos' })
      );
      return;
    }

    if (
      this.form1Business.controls.password.value !==
      this.form1Business.controls.confirmPassword.value
    ) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'Las contraseñas no coinciden' })
      );
      return;
    }

    let formdata: FormData = new FormData();

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
    formdata.append('id_user_gender', '1');

    formdata.append('user_password', this.form1Business.get('password')?.value);
    formdata.append(
      'user_confirm_password',
      this.form1Business.get('confirmPassword')?.value
    );
    formdata.append('id_role', '2');

    if (this.dataImage) {
      formdata.append(
        'user_profile_photo',
        this.dataImage,
        this.dataImage.name
      );
    }

    this.store.dispatch(
      setEmailVerification({ email: this.form1Business.get('mail')?.value })
    );

    const suscruption5 = this.grservice
      .setRegiter(formdata, 2)
      .subscribe((index) => {
        if (!index) {
          this.store.dispatch(
            setIsErrorMessage({
              message: 'Nombre de usuario o correo electrónico ya existen',
            })
          );
          return;
        }
        this.form1Business.reset();
        this.matDialog.open(ModalSendMailComponent);
        // this.router.navigate(['register/businessman/preferences']);
      });
    this.suscription.push(suscruption5);
  }

  submitAddProfile() {
    if (this.form1Business.invalid) {
      this.form1Business.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completar todos los campos' })
      );
      return;
    }

    let formdata: FormData = new FormData();

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

    const suscruption5 = this.grservice
      .setAddRole(this.dataUser.id_user, 2)
      .subscribe((res) => {
        if (!res) {
          this.store.dispatch(
            setIsErrorMessage({
              message: 'Error al agregar rol, intentelo más tarde',
            })
          );
          return;
        }

        this.grservice.setRegiterPUT(formdata).subscribe((index) => {
          if (!index) {
            this.store.dispatch(
              setIsErrorMessage({
                message: 'Error al guardar los datos, intentalo más tarde',
              })
            );
            return;
          }
        });

        this.router.navigate(['register/businessman/preferences']);
      });

    this.suscription.push(suscruption5);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
