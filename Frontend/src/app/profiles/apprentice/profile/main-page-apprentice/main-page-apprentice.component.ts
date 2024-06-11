import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AppState } from 'src/app/store/app.state';
import {
  selectApprentice,
  selectDataShared,
  selectErrorMessage,
  selectLoading,
} from 'src/app/store/selectors/global.selector';
import { ApprenticeService } from '../services/apprentice.service';
import { MainPageBodyApprenticeComponent } from '../body-apprentice/main-page-body-apprentice/main-page-body-apprentice.component';
import { MainPageHeaderApprenticeComponent } from '../header-apprentice/main-page-header-apprentice/main-page-header-apprentice.component';
import { MainPageMenuApprenticeComponent } from '../menu-aprendice/main-page-menu-apprentice/main-page-menu-apprentice.component';
import { NgClass, NgIf } from '@angular/common';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { FlotingAlertComponent } from 'src/app/shared/floting-alert/floting-alert.component';
import {
  setOpenModalSkills,
  setOpenModalTypeLearning,
  setShowModalMenuApprentice,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { MainPageTypeLearningComponent } from '../body-apprentice/modals-type-learning/main-page-type-learning/main-page-type-learning.component';
import { MainPageModalSkillsComponent } from '../body-apprentice/modal-skills/main-page-modal-skills/main-page-modal-skills.component';
import { setActualIdRol } from 'src/app/store/actions/shared.actions';
import { handleSaveActualIdRole } from 'src/app/profiles/shared/helpers';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalReloginComponent } from 'src/app/profiles/shared/modal-relogin/modal-relogin.component';

@Component({
  selector: 'app-main-page-apprentice',
  templateUrl: './main-page-apprentice.component.html',
  styleUrls: ['./main-page-apprentice.component.css'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    MainPageMenuApprenticeComponent,
    MainPageHeaderApprenticeComponent,
    MainPageBodyApprenticeComponent,
    LoadingComponent,
    FlotingAlertComponent,
    MainPageTypeLearningComponent,
    MainPageModalSkillsComponent,
    MatDialogModule,
  ],
})
export class MainPageApprenticeComponent implements OnInit, OnDestroy {
  actualId: number;

  isLoading: boolean = false;
  message: string = '';
  isErrorAlert: boolean = false;
  isModalTypeLearning: boolean = false;
  isModalSkills: boolean = false;

  suscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private sharedService: SharedService,
    private apprenticeService: ApprenticeService,
    private matdialog: MatDialog
  ) {
    // ProtectedRouteAdminLogin(this.router);

    const suscruption1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.actualId = data.actualId;
      });
    this.suscription.add(suscruption1);
  }

  ngOnInit(): void {
    this.store.dispatch(setActualIdRol({ id: 3 }));
    handleSaveActualIdRole(3);

    const suscription2 = this.store.select(selectLoading).subscribe((data) => {
      this.isLoading = data.isLoading;
    });

    const suscription3 = this.store
      .select(selectErrorMessage)
      .subscribe((data) => {
        this.message = data.message;
        this.isErrorAlert = data.isError;
      });

    this.suscription.add(suscription2);
    this.suscription.add(suscription3);

    this.handleRequest();

    this.store.dispatch(setShowModalMenuApprentice({ value: false }));
  }

  handleRequest() {
    const token = localStorage.getItem('@access_token');

    if (!token) {
      this.matdialog.open(ModalReloginComponent);
      return;
    }

    this.sharedService.getVerifyToken(token).subscribe((res) => {
      if (!res) return;
      if (typeof res === 'number') {
        this.matdialog.open(ModalReloginComponent);
        return;
      }

      this.sharedService.getDataRegister();
      this.apprenticeService.getAllCourses();
      this.apprenticeService.getCarShop(res.id_user);
      this.apprenticeService.getMyCourses(res.id_user);

      const suscruption4 = this.store
        .select(selectApprentice)
        .subscribe((data) => {
          this.isModalTypeLearning = data.showModalTypeLearning;
          this.isModalSkills = data.showModalSkills;
        });

      this.suscription.add(suscruption4);

      this.store.select(selectDataShared).subscribe((data) => {
        if (!data.dataUserRegister) return;
        if (data.dataUserRegister.skills.length === 0) {
          this.store.dispatch(setOpenModalSkills({ value: true }));
          return;
        }
        if (!data.dataUserRegister?.learning_style) {
          this.store.dispatch(setOpenModalTypeLearning({ value: true }));
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
