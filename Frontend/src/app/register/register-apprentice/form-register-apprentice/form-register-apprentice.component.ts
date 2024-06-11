import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ValidatorService } from 'src/app/shared/validator/validator.service';
import { GlobalRegisterService } from '../../services/register.service';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { APIKEY_RECAPCHA, ROUTES } from 'src/app/shared/constants';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { RecaptchaModule } from 'ng-recaptcha';
import { IonicModule } from '@ionic/angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { handleKeyDown } from 'src/app/shared/helpers';
import { MatDialog } from '@angular/material/dialog';
import { ModalSendMailComponent } from '../../shared/modal-send-mail/modal-send-mail.component';
import { setEmailVerification } from 'src/app/store/actions/current-window.actions';
import { DataUserRegister } from 'src/app/shared/interfaces';
import { selectDataShared } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-form-register-apprentice',
  templateUrl: './form-register-apprentice.component.html',
  styleUrls: ['./form-register-apprentice.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgFor,
    NgIf,
    MatTooltipModule,
    IonicModule,
    RecaptchaModule,
    MatTooltipModule,
    RouterLink,
  ],
})
export class FormRegisterApprenticeComponent implements OnDestroy {
  form1A: FormGroup = this.fb.group({
    allName: [''],
    userName: [''],
    mail: ['', Validators.email],
    typeIdentification: [''],
    phone: [''],
    identification: [''],
    genre: [''],
    password: [''],
    confirmPassword: [''],
  });

  errorForm: boolean = false;
  isEqualPasswords: boolean = false;

  typeIdentificaction: { id: number; name: string }[] = [
    { id: 1, name: 'Cédula de ciudadanía' },
    { id: 2, name: 'Cédula de extranjería' },
    { id: 3, name: 'Nit' },
  ];

  genre: { id: number; name: string }[] = [
    { id: 1, name: 'Hombre' },
    { id: 2, name: 'Mujer' },
    { id: 3, name: 'Otro' },
  ];

  dataRol = ['Caficultor', 'Comprador', 'Aprendiz'];

  dataImage: any = undefined;
  image: any = undefined;

  isErrorRegister: boolean = false;
  isShowPassword: boolean = false;
  isShowRepeatPassword: boolean = false;
  isCheckRepapcha: boolean = false;

  apikey: string = '';
  dataUser: DataUserRegister;

  actualIdRole: number = NaN;

  private suscription: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private vs: ValidatorService,
    private grservice: GlobalRegisterService,
    private router: Router,
    private store: Store<AppState>,
    private matDialog: MatDialog
  ) {
    this.apikey = APIKEY_RECAPCHA;
  }

  ngOnInit(): void {
    const suscription = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        if (!data.dataUserRegister) {
          this.router.navigate(['register/apprentice']);
          return;
        }
        this.actualIdRole = data.actualIdRole;
        this.dataUser = data.dataUserRegister;

        this.form1A.get('allName')?.setValue(data.dataUserRegister.user_name);
        this.form1A.get('phone')?.setValue(data.dataUserRegister.user_phone);

        this.form1A.get('mail')?.setValue(data.dataUserRegister.user_email);

        this.form1A
          .get('userName')
          ?.setValue(data.dataUserRegister.user_username);

        this.form1A
          .get('identification')
          ?.setValue(data.dataUserRegister.number_document);
      });

    this.suscription.push(suscription);

    this.onChangeFormA();
  }

  validatorFields(field: string) {
    if (
      this.form1A.controls[field].errors &&
      this.form1A.controls[field].touched
    ) {
      this.errorForm = true;
    } else {
      this.errorForm = false;
    }
    return (
      this.form1A.controls[field].errors && this.form1A.controls[field].touched
    );
  }

  onChangeFormA() {
    const suscruption1 = this.form1A.valueChanges.subscribe(
      (data) => (this.isErrorRegister = false)
    );

    this.suscription.push(suscruption1);
  }

  onChangeLoadImage(event: any) {
    if (event.target.files[0].size < 1000000) {
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
    } else {
      this.store.dispatch(
        setIsErrorMessage({ message: 'La imagen cargada pesa más de 1Mb' })
      );
    }
  }

  handleKeyDown(e: any) {
    handleKeyDown(e);
  }

  comeBack() {
    if (!this.dataUser) {
      this.router.navigate([ROUTES.REGISTER + '/profiles']);
    } else {
      if (this.actualIdRole === 1) {
        this.router.navigate([ROUTES.USER_FARMER]);
      } else {
        this.router.navigate([ROUTES.USER_BUSINESSMAN]);
      }
    }
  }

  showPassword(id: number) {
    if (id === 1) {
      this.isShowPassword = !this.isShowPassword;
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
      this.submitRegisterPUT();
    }
  }

  submitRegister() {
    if (this.form1A.invalid) {
      this.form1A.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completar todos los campos' })
      );
      return;
    }

    if (!this.isCheckRepapcha) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completa el recapcha' })
      );
      return;
    }

    if (
      this.form1A.controls.password.value !==
      this.form1A.controls.confirmPassword.value
    ) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'Las contraseñas no coinciden' })
      );
      return;
    }

    let formdata: FormData = new FormData();

    formdata.append('user_name', this.form1A.get('allName')?.value);
    formdata.append('user_phone', this.form1A.get('phone')?.value);
    formdata.append('user_email', this.form1A.get('mail')?.value);
    formdata.append('id_user_gender', this.form1A.get('genre')?.value);
    formdata.append('user_username', this.form1A.get('userName')?.value);
    formdata.append('user_password', this.form1A.get('password')?.value);
    formdata.append(
      'user_confirm_password',
      this.form1A.get('confirmPassword')?.value
    );
    formdata.append(
      'id_type_document',
      this.form1A.get('typeIdentification')?.value
    );
    formdata.append(
      'number_document',
      this.form1A.get('identification')?.value
    );
    formdata.append('id_role', '3');

    if (this.dataImage) {
      formdata.append(
        'user_profile_photo',
        this.dataImage,
        this.dataImage.name
      );
    }

    this.store.dispatch(
      setEmailVerification({ email: this.form1A.get('mail')?.value })
    );

    const suscruption2 = this.grservice
      .setRegiterApprentice(formdata)
      .subscribe((response) => {
        if (!response) {
          return;
        }

        this.form1A.reset();
        this.matDialog.open(ModalSendMailComponent);
      });

    this.suscription.push(suscruption2);
  }

  submitRegisterPUT() {
    console.log({ form: this.form1A.value });

    this.form1A.get('');

    if (this.form1A.invalid) {
      this.form1A.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, completar todos los campos' })
      );
      return;
    }

    let formdata: FormData = new FormData();

    formdata.append('user_name', this.form1A.get('allName')?.value);
    formdata.append('user_phone', this.form1A.get('phone')?.value);
    formdata.append('user_email', this.form1A.get('mail')?.value);
    formdata.append('id_user_gender', this.form1A.get('genre')?.value);
    formdata.append('user_username', this.form1A.get('userName')?.value);

    formdata.append(
      'id_type_document',
      this.form1A.get('typeIdentification')?.value
    );
    formdata.append(
      'number_document',
      this.form1A.get('identification')?.value
    );

    const suscruption = this.grservice
      .setAddRole(this.dataUser.id_user, 3)
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
                message: 'Error al guardar los datos, intentelo más tarde',
              })
            );
            return;
          }
          this.router.navigate([ROUTES.USER_APPRENTICE]);
        });
      });

    this.suscription.push(suscruption);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
