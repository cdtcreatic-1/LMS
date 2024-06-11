import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { GlobalTitlesComponent } from 'src/app/shared/global-titles/global-titles.component';
import { handleKeyDown } from 'src/app/shared/helpers';
import { SharedService } from 'src/app/shared/services/shared.service';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { setChangeActualIdApprentice } from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';
import { selectDataShared } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-edit-profile-apprentice',
  templateUrl: './edit-profile-apprentice.component.html',
  styleUrls: ['./edit-profile-apprentice.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    MatTooltipModule,
    GlobalButtonsComponent,
    GlobalTitlesComponent,
    ReactiveFormsModule,
  ],
})
export class EditProfileApprenticeComponent implements OnInit {
  form: FormGroup = this.fb.group({
    allName: [''],
    phone: [''],
    mail: [''],
    userName: [''],
    identification: [''],
  });

  dataRol = ['Caficultor', 'Comprador', 'Aprendiz'];

  pathPhoto: string | null = '';

  dataImage: any = undefined;
  image: any = undefined;
  id_user: number = NaN;

  private suscription: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private grservice: GlobalRegisterService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const suscription1 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        if (data.dataUserRegister) {
          this.image = data.dataUserRegister.user_profile_photo;
          this.id_user = data.dataUserRegister.id_user;
          this.form.get('allName')?.setValue(data.dataUserRegister.user_name);
          this.form.get('phone')?.setValue(data.dataUserRegister.user_phone);
          this.form.get('mail')?.setValue(data.dataUserRegister.user_email);
          this.form
            .get('userName')
            ?.setValue(data.dataUserRegister.user_username);
          this.form
            .get('identification')
            ?.setValue(data.dataUserRegister.number_document);
        }
      });

    this.suscription.push(suscription1);
  }

  validatorFields(field: string) {
    return (
      this.form.controls[field].errors && this.form.controls[field].touched
    );
  }

  handleKeyDown(e: any) {
    handleKeyDown(e);
  }

  onChangeLoadImage(event: any) {
    if (event.target.files[0].size > 1000000) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'La imagen cargada pesa más de 1Mb' })
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let formdata: FormData = new FormData();

    formdata.append('id_user', this.id_user.toString());
    formdata.append('user_name', this.form.get('allName')?.value);
    formdata.append('user_phone', this.form.get('phone')?.value);
    formdata.append('user_email', this.form.get('mail')?.value);
    formdata.append('user_username', this.form.get('userName')?.value);

    formdata.append('id_type_document', '1');
    formdata.append('number_document', this.form.get('identification')?.value);
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
        this.store.dispatch(setChangeActualIdApprentice({ value: 1 }));
      });

    this.suscription.push(suscription3);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
