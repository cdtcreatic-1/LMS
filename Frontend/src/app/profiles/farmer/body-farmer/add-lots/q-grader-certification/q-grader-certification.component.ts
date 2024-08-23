import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataCurrentWindow } from 'src/app/register/interfaces';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { AppState } from 'src/app/store/app.state';
import { setActualIdRegisterLot } from 'src/app/store/actions/user-menu.actions';
import { setCertificates } from 'src/app/store/actions/add-lots.actions';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { selectAddLots } from 'src/app/store/selectors/global.selector';
import { NgIf, NgStyle } from '@angular/common';
import { ErrorsFormsComponent } from 'src/app/shared/errors-forms/errors-forms.component';

@Component({
  selector: 'app-q-grader-certification',
  templateUrl: './q-grader-certification.component.html',
  styleUrls: ['./q-grader-certification.component.css'],
  standalone: true,
  imports: [NgIf, NgStyle, ErrorsFormsComponent],
})
export class QGraderCertificationComponent implements OnInit {
  dataCurrentWindow: DataCurrentWindow & { id_user: number };

  dataCCoffee: any = undefined;
  imageCCoffee: any = undefined;

  dataCCatador: any = undefined;
  imageCCatador: any = undefined;

  isCheckBox: boolean = false;

  isErrorRequiredDocuments: boolean = false;
  isErrorLoadDocuments: boolean = false;

  constructor(
    private grservice: GlobalRegisterService,
    private store: Store<AppState>
  ) {
    this.dataCurrentWindow = this.grservice.dataCurrentWindow;
  }

  ngOnInit(): void {
    this.store.select(selectAddLots).subscribe((data) => {
      if (data.dataCertificates) {
        const {
          pathImageTest,
          pathImageCatador,
          dataImageTest,
          dataImageCatador,
        } = data.dataCertificates;
        this.imageCCoffee = pathImageTest;
        this.imageCCatador = pathImageCatador;
        this.dataCCoffee = dataImageTest;
        this.dataCCatador = dataImageCatador;
      }
    });
  }

  onChangeLoadImage(event: any, id: number) {
    this.isErrorRequiredDocuments = false;

    if (event.target.files[0].size > 3000000) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'El archivo pesa más de 3Mb' })
      );
      return;
    }

    if (
      event.target.files[0].type === 'image/png' ||
      event.target.files[0].type === 'image/jpeg' ||
      event.target.files[0].type === 'application/pdf'
    ) {
      const dataImage = event.target.files[0];
      if (id === 1) {
        this.dataCCoffee = dataImage;
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (reader.result?.slice(5, 16) === 'application') {
              this.imageCCoffee = 'pdf';
            } else {
              this.imageCCoffee = reader.result as string;
            }
          };
        }
      } else {
        this.dataCCatador = dataImage;
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (reader.result?.slice(5, 16) === 'application') {
              this.imageCCatador = 'pdf';
            } else {
              this.imageCCatador = reader.result as string;
            }
          };
        }
      }
    } else {
      this.store.dispatch(
        setIsErrorMessage({
          message:
            'Formato no permitido, cargue una imagen en png/jpg o un pdf',
        })
      );
      return;
    }
  }

  onClickCheckBox() {
    this.isCheckBox = !this.isCheckBox;
  }

  comeBack() {
    this.store.dispatch(setActualIdRegisterLot({ actualId: 2.3 }));
  }

  next() {
    if (this.dataCCoffee || this.dataCCatador) {
      let formdata: FormData = new FormData();

      if (this.dataCCoffee) {
        formdata.append(
          'product_sc_certificate',
          this.dataCCoffee,
          this.dataCCoffee.name
        );
      }

      if (this.dataCCatador) {
        formdata.append(
          'product_taster_certificate',
          this.dataCCatador,
          this.dataCCatador.name
        );
      }

      formdata.append('contact_qgrader', `${this.isCheckBox}`);

      this.store.dispatch(
        setCertificates({
          data: {
            dataImageTest: this.dataCCoffee,
            pathImageTest: this.imageCCoffee,
            dataImageCatador: this.dataCCatador,
            pathImageCatador: this.imageCCatador,
            dataRequest: formdata,
          },
        })
      );
    }

    this.store.dispatch(setActualIdRegisterLot({ actualId: 2.5 }));
    // else {
    //   this.store.dispatch(
    //     setIsErrorMessage({ message: 'Por favor, cargue los documentos' })
    //   );
    // }
  }
}
