import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ROUTES } from 'src/app/shared/constants';
import { HomeFooterComponent } from '../home-footer/home-footer.component';
import { StartsComponent } from '../../shared/starts/starts.component';
import { NgFor, NgStyle } from '@angular/common';
import { clearCurrentWindow } from 'src/app/store/actions/current-window.actions';
import { AppState } from 'src/app/store/app.state';
import { TrendsFarmersComponent } from '../trends-farmers/trends-farmers.component';
import { OurProfilesComponent } from '../our-profiles/our-profiles.component';
import { VideosHomeComponent } from '../videos-home/videos-home.component';
import { CarrouselHomeComponent } from '../carrousel-home/carrousel-home.component';
import { ProtectedRouteAdminLogin } from 'src/app/shared/helpers';
import { clearShared } from 'src/app/store/actions/shared.actions';
import { SharedService } from 'src/app/shared/services/shared.service';
import { selectBusinessProfile } from 'src/app/store/selectors/global.selector';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalDeleteComponent } from 'src/app/admin/profile/body-admin/add-courses/shared/modal-delete/modal-delete.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-main-page-home',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  standalone: true,
  imports: [
    NgFor,
    NgStyle,
    StartsComponent,
    HomeFooterComponent,
    TrendsFarmersComponent,
    OurProfilesComponent,
    VideosHomeComponent,
    CarrouselHomeComponent,
    MatDialogModule,
  ],
})
export class MainPageComponent implements OnInit, OnDestroy {
  videoUrl: SafeResourceUrl;

  private suscription: Subscription[] = [];

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    private matdialog: MatDialog
  ) {
    // ProtectedRouteAdminLogin(this.router)

    // localStorage.clear();

    // this.matdialog.open(ModalDeleteComponent, {
    //   data: { nameItem: 'Curso', handleSubmit: this.handleSubmitTest },
    // });

    this.store.dispatch(clearCurrentWindow());
    this.store.dispatch(clearShared());

    const codigoInsercion = 'cSOG5yXxR-A?si=Yf1y-zHBPTPTIxud'; // Reemplaza con tu código de inserción
    const url = `https://www.youtube.com/embed/${codigoInsercion}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
    const suscription1 = this.store
      .select(selectBusinessProfile)
      .subscribe((data) => {
        if (data.dataTrends.length === 0) {
          this.sharedService.getTrends(1);
        }
      });

    this.suscription.push(suscription1);
  }

  handleSubmitTest() {
    console.log('Hellow world');
  }

  login() {
    this.router.navigate([ROUTES.LOGIN]);
  }

  register() {
    this.router.navigate([ROUTES.REGISTER + '/profiles']);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
