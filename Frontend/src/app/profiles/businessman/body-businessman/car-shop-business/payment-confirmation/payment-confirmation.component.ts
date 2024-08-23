import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ROUTES } from 'src/app/shared/constants';
import { AppState } from 'src/app/store/app.state';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BodyBusinessmanService } from '../../services/body-businessman.service';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';
import { ModalResponsePaymentComponent } from '../modal-response-payment/modal-response-payment.component';
import { setStatusPayment } from 'src/app/store/actions/user-menu-businessman.actions';
import { NgIf } from '@angular/common';
import { selectLoading } from 'src/app/store/selectors/global.selector';
import {
  setChangeActualIdApprentice,
  setStatusPaymentApprentice,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { ModalResponsePaymentApprenticeComponent } from 'src/app/profiles/apprentice/profile/body-apprentice/modal-response-payment-apprentice/modal-response-payment-apprentice';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ApprenticeService } from 'src/app/profiles/apprentice/profile/services/apprentice.service';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { Subscription } from 'rxjs';
import { BodyFarmerService } from 'src/app/profiles/farmer/services/body-farmer.service';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css'],
  standalone: true,
  imports: [MatDialogModule, NgIf, LoadingComponent],
})
export class PaymentConfirmationComponent implements OnInit, OnDestroy {
  status: number = 1;

  isLoading: boolean = false;

  suscription: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private matDialog: MatDialog,
    private bbservice: BodyBusinessmanService,
    private sharedService: SharedService,
    private appservice: ApprenticeService,
    private bfservice: BodyFarmerService
  ) {}

  ngOnInit() {
    const suscription1 = this.store.select(selectLoading).subscribe((data) => {
      this.isLoading = data.isLoading;
    });

    const idRole = localStorage.getItem('@actualIdRole');
    const actualIdRole = idRole ? parseInt(idRole) : NaN;

    const id = this.route.snapshot.paramMap.get('id');
    const suscription2 = this.route.queryParams.subscribe((params) => {
      const epaycoValue: any = params['ref_payco'];
      if (epaycoValue) {
        const token = localStorage.getItem('@access_token');

        this.sharedService.getVerifyToken(token!).subscribe((resToken) => {
          if (!resToken) {
            this.status = 2;
            return;
          }
          if (typeof resToken === 'number') {
            this.status = 2;
            return;
          }

          if (actualIdRole === 2) {
            this.bbservice
              .setParseReference(epaycoValue)
              .subscribe((resEpayco) => {
                if (!resEpayco) {
                  {
                    this.status = 2;
                    return;
                  }
                }
                if (!id) return;

                this.store.dispatch(setStatusPayment({ value: parseInt(id) }));
                this.router.navigate([ROUTES.USER_BUSINESSMAN]);

                this.bfservice.getTableStateSell(2);
                this.sharedService.getDataRegister();
                this.store.dispatch(
                  setChangeActualIdDasboard({ actualId: 12 })
                );
                this.matDialog.open(ModalResponsePaymentComponent);
              });
          } else if (actualIdRole === 3) {
            this.appservice
              .setParseReferenceApprentice(epaycoValue)
              .subscribe((resEpayco) => {
                if (!resEpayco) {
                  {
                    this.status = 2;
                    return;
                  }
                }
                if (!id) return;

                this.store.dispatch(
                  setStatusPaymentApprentice({ value: parseInt(id) })
                );
                this.appservice.getMyCourses(resToken.id_user);
                this.router.navigate([ROUTES.USER_APPRENTICE]);
                this.store.dispatch(setChangeActualIdApprentice({ value: 5 }));

                this.matDialog.open(ModalResponsePaymentApprenticeComponent);
              });
          }
        });
      } else {
        this.status = 2;
      }
    });

    this.suscription.push(suscription1);
    this.suscription.push(suscription2);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
