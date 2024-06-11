import { Component } from '@angular/core';
import { BodyFarmerService } from '../../../services/body-farmer.service';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataCurrentWindow } from 'src/app/store/selectors/global.selector';
import { NgIf } from '@angular/common';
import { ErrorsFormsComponent } from 'src/app/shared/errors-forms/errors-forms.component';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ModalCongratulationDocumentsComponent } from '../../modal-congratulation-documents/modal-congratulation-documents.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-load-document',
  templateUrl: './load-documents.component.html',
  styleUrls: ['./load-documents.component.css'],
  standalone: true,
  imports: [NgIf, ErrorsFormsComponent, MatDialogModule],
})
export class LoadDocumentsComponent {
  dataCedula: any = undefined;
  imageCedula: any = undefined;

  dataRut: any = undefined;
  imageRut: any = undefined;

  dataCamara: any = undefined;
  imageCamara: any = undefined;

  isErrorRequiredDocuments: boolean = false;
  isErrorLoadDocuments: boolean = false;

  idFarm: number;

  constructor(
    private bfservice: BodyFarmerService,
    private store: Store<AppState>,
    private shservice: SharedService,
    private matDialog: MatDialog
  ) {
    this.store.select(selectDataCurrentWindow).subscribe((data) => {
      this.idFarm = data.dataCurrentWindow?.id_farm!;
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
    if (event.target.files[0].type === 'application/pdf') {
      const dataImage = event.target.files[0];
      if (id === 1) {
        this.dataCedula = dataImage;
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (reader.result?.slice(5, 16) === 'application') {
              this.imageCedula = 'pdf';
            } else {
              this.imageCedula = reader.result as string;
            }
          };
        }
      } else if (id == 2) {
        this.dataRut = dataImage;
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (reader.result?.slice(5, 16) === 'application') {
              this.imageRut = 'pdf';
            } else {
              this.imageRut = reader.result as string;
            }
          };
        }
      } else {
        this.dataCamara = dataImage;
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (reader.result?.slice(5, 16) === 'application') {
              this.imageCamara = 'pdf';
            } else {
              this.imageCamara = reader.result as string;
            }
          };
        }
      }
    } else {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Formato no permitido, cargue un documento en pdf',
        })
      );
      return;
    }
  }

  comeBack() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 3 }));
  }
  next() {
    if (this.dataCedula && this.dataRut && this.dataCamara) {
      let formdata: FormData = new FormData();
      formdata.append(
        'farm_documentation_id_document',
        this.dataCedula,
        this.dataCedula.name
      );

      formdata.append(
        'farm_documentation_rut',
        this.dataRut,
        this.dataRut.name
      );

      formdata.append(
        'farm_documentation_chamber_commerce',
        this.dataCamara,
        this.dataCamara.name
      );

      this.bfservice
        .setDocumentsFarmer(formdata, this.idFarm)
        .subscribe((res) => {
          if (!res) {
            this.store.dispatch(
              setIsErrorMessage({
                message: 'Error al cargar los documentos, intentelo más tarde',
              })
            );
            return;
          }
          this.bfservice.getDocumentsFarmer();
          this.shservice.getDataRegister();
          this.matDialog.open(ModalCongratulationDocumentsComponent);
          this.store.dispatch(setChangeActualIdDasboard({ actualId: 3 }));
        });
    } else {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor, cargue todos los documentos solicitados',
        })
      );
    }
  }
}
