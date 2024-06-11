import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataCurrentWindow } from 'src/app/register/interfaces';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { AppState } from 'src/app/store/app.state';
import { MainRegisterLotsService } from '../services/main-register-lots.serice.service';
import {
  setActualIdRegisterLot,
  setChangeActualIdDasboard,
} from 'src/app/store/actions/user-menu.actions';
import { BodyFarmerService } from '../../../services/body-farmer.service';
import { Subscription } from 'rxjs';
import {
  selectAddLots,
  selectDataUser,
} from 'src/app/store/selectors/global.selector';
import {
  FormCertificates,
  FormPriceCoffee,
  FormReviewCoffee,
  FormTypeCoffee,
} from '../interfaces';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { clearStateAddLots } from 'src/app/store/actions/add-lots.actions';
import { NgIf } from '@angular/common';
import { setIsLoading } from 'src/app/store/actions/loading.actions';

@Component({
  selector: 'app-load-photo',
  templateUrl: './load-photo.component.html',
  styleUrls: ['./load-photo.component.css'],
  standalone: true,
  imports: [NgIf],
})
export class LoadPhotoComponent implements OnInit, OnDestroy {
  dataCurrentWindow: DataCurrentWindow & { id_user: number };

  dataImg1: any = undefined;
  imageImg1: any = undefined;

  idFarm: number = NaN;

  flag: boolean = true;

  subscription = new Subscription();

  bodyTypeCoffee?: FormTypeCoffee;
  bodyPriceCoffee?: FormPriceCoffee;
  bodyReviewCoffee?: FormReviewCoffee;
  dataCertificates?: FormData;
  dataOrgCertificate?: FormCertificates;

  constructor(
    private grservice: GlobalRegisterService,
    private store: Store<AppState>,
    private addLotsService: MainRegisterLotsService,
    private bfservice: BodyFarmerService
  ) {
    this.dataCurrentWindow = this.grservice.dataCurrentWindow;
  }

  ngOnInit(): void {
    const subscription1 = this.store
      .select(selectDataUser)
      .subscribe((data) => {
        this.idFarm = data.farmSelected?.id_farm!;
      });

    const subscription2 = this.store.select(selectAddLots).subscribe((data) => {
      this.bodyTypeCoffee = data.formTypeCoffee;
      this.bodyPriceCoffee = data.formPriceCoffee;
      this.bodyReviewCoffee = data.formReviewCoffee;
      this.dataCertificates = data.dataCertificates?.dataRequest;
      this.dataOrgCertificate = data.dataCertificates;
    });

    this.subscription.add(subscription1);
    this.subscription.add(subscription2);
  }

  onChangeLoadImage(event: any, id: number) {
    if (event.target.files[0].size > 3000000) {
      this.store.dispatch(
        setIsErrorMessage({ message: 'El archivo pesa más de 3Mb' })
      );
      return;
    }

    if (
      event.target.files[0].type === 'image/png' ||
      event.target.files[0].type === 'image/jpeg'
    ) {
      const dataImage = event.target.files[0];
      if (id === 1) {
        this.dataImg1 = dataImage;
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.imageImg1 = reader.result as string;
          };
        }
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

  comeBack() {
    this.store.dispatch(setActualIdRegisterLot({ actualId: 2.4 }));
  }

  next() {
    if (this.dataImg1) {
      this.store.dispatch(setIsLoading({ value: true }));
      const subscription3 = this.addLotsService
        .RegisterLots(this.bodyTypeCoffee!)
        .subscribe(async (idLot: number) => {
          if (idLot > 0) {
            let formdataPhoto: FormData = new FormData();
            formdataPhoto.append('id_lot', idLot.toString());
            formdataPhoto.append(
              'lot_photo',
              this.dataImg1,
              this.dataImg1.name
            );

            const data: FormData = new FormData();

            data.append('id_lot', idLot.toString());

            if (this.dataOrgCertificate?.dataImageTest) {
              data.append(
                'product_sc_certificate',
                this.dataOrgCertificate?.dataImageTest,
                this.dataOrgCertificate?.dataImageTest.name
              );
            }

            if (this.dataOrgCertificate?.dataImageCatador) {
              data.append(
                'product_taster_certificate',
                this.dataOrgCertificate?.dataImageCatador,
                this.dataOrgCertificate?.dataImageCatador.name
              );
            }

            data.append('contact_qgrader', 'true');

            await this.addLotsService.promiseAll(
              { ...this.bodyPriceCoffee!, id_lot: idLot },
              { ...this.bodyReviewCoffee!, id_lot: idLot },
              !this.dataOrgCertificate?.dataImageTest &&
                !this.dataOrgCertificate?.dataImageCatador
                ? null
                : data,
              formdataPhoto
            );

            this.bfservice.getAllLotsByFarm(this.idFarm);
            this.store.dispatch(setChangeActualIdDasboard({ actualId: 2 }));
            this.store.dispatch(setActualIdRegisterLot({ actualId: 2.1 }));
            this.store.dispatch(clearStateAddLots());
          }
        });
      this.subscription.add(subscription3);
    } else {
      this.store.dispatch(
        setIsErrorMessage({ message: 'Por favor, cargue una foto' })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
