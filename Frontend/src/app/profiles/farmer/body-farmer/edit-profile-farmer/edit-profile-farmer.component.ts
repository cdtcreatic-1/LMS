import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataUser } from 'src/app/store/selectors/global.selector';
import { RegisterService } from 'src/app/register/shared/services/register.service';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { NavbarFarmerComponent } from '../../navbar-farmer/navbar-farmer.component';
import { NgClass, NgIf } from '@angular/common';
import { DataRegister } from 'src/app/register/register-farmer/interface';
import { MatTooltipModule } from '@angular/material/tooltip';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { handleKeyDown } from 'src/app/shared/helpers';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile-farmer',
  templateUrl: './edit-profile-farmer.component.html',
  styleUrls: [
    './edit-profile-farmer.component.css',
    '../../header-farmer/header-farmer.component.css',
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NavbarFarmerComponent,
    MatTooltipModule,
    NgClass,
    IonicModule,
  ],
})
export class EditProfileFarmerComponent implements OnInit {
  form1AEdit: FormGroup = this.fb.group({
    allName: [''],
    userName: [''],
    mail: ['', [Validators.email]],
    descriptionText: [''],
    phone: ['', ,],
  });

  dataRol = ['Caficultor', 'Comprador', 'Aprendiz'];

  pathPhoto: string = '';

  dataImage: any = undefined;
  dataImagePortada: any = undefined;
  imagePortada: any = undefined;
  image: any = undefined;
  user_id: string = localStorage.getItem('@userId')!;
  dataUserRegister?: DataRegister;

  isErrorEditRegister: boolean = false;
  isErrorLoadText: boolean = false;

  constructor(
    private fb: FormBuilder,
    private rservice: RegisterService,
    private store: Store<AppState>,
    private grservice: GlobalRegisterService
  ) {}

  ngOnInit(): void {
    this.store.select(selectDataUser).subscribe((data) => {
      if (data.dataRegister) {
        this.dataUserRegister = data.dataRegister;
        this.pathPhoto = data.dataRegister.User?.user_profile_photo;
        this.form1AEdit
          .get('allName')
          ?.setValue(data.dataRegister.User.user_name);
        this.form1AEdit
          .get('phone')
          ?.setValue(data.dataRegister.User.user_phone);
        this.form1AEdit
          .get('userName')
          ?.setValue(data.dataRegister.User.user_username);
        this.form1AEdit
          .get('mail')
          ?.setValue(data.dataRegister.User.user_email);
        this.form1AEdit
          .get('descriptionText')
          ?.setValue(data.dataRegister.user_personal_description_text);
        this.imagePortada = data.dataRegister.User.user_cover_photo;
        this.image = data.dataRegister.User.user_profile_photo;
      }
    });
    this.onChangeFormAEdit();
  }

  validatorFields(field: string) {
    return (
      this.form1AEdit.controls[field].errors &&
      this.form1AEdit.controls[field].touched
    );
  }

  onChangeFormAEdit() {
    this.form1AEdit.valueChanges.subscribe(
      (data) => (this.isErrorEditRegister = false)
    );
  }

  handleKeyDown(e: any) {
    handleKeyDown(e);
  }

  onChangeLoadImage(event: any) {
    if (event.target.files[0].size > 1000000) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'El archivo pesa más de 1Mb' })
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
          message: 'Formato no permitido, cargue una imagen en png o jpg',
        })
      );
      return;
    }
  }

  onChangeLoadPortada(event: any) {
    if (event.target.files[0].size > 1000000) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'El archivo pesa más de 1Mb' })
      );
      return;
    }

    if (
      event.target.files[0].type === 'image/png' ||
      event.target.files[0].type === 'image/jpeg'
    ) {
      const dataImagePortada = event.target.files[0];
      this.dataImagePortada = dataImagePortada;

      const reader = new FileReader();

      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.imagePortada = reader.result as string;
        };
      }

      let formdata: FormData = new FormData();
      formdata.append('id_user', this.user_id);
      formdata.append(
        'user_cover_photo',
        this.dataImagePortada,
        this.dataImagePortada.name
      );
      this.grservice.setCoverPortadaPUT(formdata).subscribe((res) => {
        if (!res) return;
      });
    } else {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Formato no permitido, cargue una imagen en png o jpg',
        })
      );
      return;
    }
  }

  comeBack() {
    this.rservice.changeIndexIndicator(-1);
  }

  save() {
    if (this.form1AEdit.invalid) {
      this.form1AEdit.markAllAsTouched();
      return;
    }

    let formdatas: FormData = new FormData();

    formdatas.append(
      'user_personal_description_text',
      this.form1AEdit.get('descriptionText')?.value
    );
    formdatas.append('id_user', this.user_id);

    this.grservice
      .LoadTextInformationPUT(this.form1AEdit.controls.descriptionText.value, 1)
      .subscribe((index) => {
        if (!index) return;
        this.grservice.getDataRegisterFarm();
      });

    let formdata: FormData = new FormData();

    formdata.append('user_name', this.form1AEdit.get('allName')?.value);
    formdata.append('user_phone', this.form1AEdit.get('phone')?.value);
    formdata.append('user_email', this.form1AEdit.get('mail')?.value);
    formdata.append('user_gender', '1');
    formdata.append('user_username', this.form1AEdit.get('userName')?.value);
    formdata.append('id_type_document', '1');
    formdata.append('number_document', '123456');
    formdata.append('id_user', this.user_id);

    if (this.dataImage) {
      formdata.append(
        'user_profile_photo',
        this.dataImage,
        this.dataImage.name
      );
    }

    this.grservice.setRegiterPUT(formdata).subscribe((index) => {
      if (!index) return;
      this.grservice.getDataRegisterFarm();
      this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
    });
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
  }
}
