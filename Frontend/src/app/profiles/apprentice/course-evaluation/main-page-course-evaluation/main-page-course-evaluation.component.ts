import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MainPageMenuComponent } from '../menu/main-page-menu/main-page-menu.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavBarCourseComponent } from '../body/nav-bar-course/nav-bar-course.component';
import { setIdSubmoduleSelected } from 'src/app/store/actions/user-menu-apprentice.action';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { CourseEvaluationService } from '../services/course-evaluation.service';
import {
  selectApprentice,
  selectErrorMessage,
  selectLoading,
} from 'src/app/store/selectors/global.selector';
import { Subscription } from 'rxjs';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { FlotingAlertComponent } from 'src/app/shared/floting-alert/floting-alert.component';
import { NgClass, NgIf } from '@angular/common';
import { ChatBootComponent } from '../../profile/body-apprentice/chat-boot/chat-boot.component';
import { ModalMenuApprenticeComponent } from '../modal-menu-apprentice/modal-menu-apprentice.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalReloginComponent } from 'src/app/profiles/shared/modal-relogin/modal-relogin.component';

@Component({
  selector: 'app-main-page-course-evaluation',
  templateUrl: './main-page-course-evaluation.component.html',
  styleUrls: ['./main-page-course-evaluation.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    HeaderComponent,
    MainPageMenuComponent,
    RouterOutlet,
    NavBarCourseComponent,
    FlotingAlertComponent,
    LoadingComponent,
    ChatBootComponent,
    ModalMenuApprenticeComponent,
    MatDialogModule,
  ],
})
export class MainPageCourseEvaluationComponent implements OnInit, OnDestroy {
  idCourse: number;
  isModalMenuApprentice: boolean = false;

  isLoading: boolean = false;
  isErrorAlert: boolean = false;
  message: string = '';

  suscription: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private store: Store<AppState>,
    private courseEvaluationService: CourseEvaluationService,
    private matdialog: MatDialog
  ) {}

  ngOnInit() {
    this.handleRequest();
  }

  handleRequest() {
    const token = localStorage.getItem('@access_token');

    if (!token) {
      this.matdialog.open(ModalReloginComponent);
      return;
    }

    const suscription0 = this.sharedService
      .getVerifyToken(token)
      .subscribe((res) => {
        if (!res) return;
        if (typeof res === 'number') {
          this.matdialog.open(ModalReloginComponent);
          return;
        }

        const idCourse = this.route.snapshot.paramMap.get('idCourse');
        const route = window.location.pathname.split('/');
        var idSubmodule = route[route.length - 1];

        if (idCourse) {
          this.store.dispatch(
            setIdSubmoduleSelected({
              id: parseInt(idSubmodule),
              id_course: parseInt(idCourse),
            })
          );
          this.idCourse = parseInt(idCourse);
          this.courseEvaluationService.getAllInfoCourse(this.idCourse);
        }

        this.sharedService.getDataRegister();

        const suscruption1 = this.store
          .select(selectErrorMessage)
          .subscribe((data) => {
            this.isErrorAlert = data.isError;
            this.message = data.message;
          });

        this.suscription.push(suscruption1);

        const suscription2 = this.store
          .select(selectLoading)
          .subscribe((data) => {
            this.isLoading = data.isLoading;
          });

        this.suscription.push(suscription2);

        const suscription3 = this.store
          .select(selectApprentice)
          .subscribe((data) => {
            this.isModalMenuApprentice = data.isModalMenuApprentice;
          });

        this.suscription.push(suscription3);
      });

    this.suscription.push(suscription0);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
