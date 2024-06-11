import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  selectApprentice,
  selectDataShared,
} from 'src/app/store/selectors/global.selector';
import { AllCourses } from '../../interfaces';
import { CommonModule, NgIf, UpperCasePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { StartsComponent } from 'src/app/shared/starts/starts.component';
import { AccordionComponent } from 'src/app/shared/accordion/accordion.component';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { ApprenticeService } from '../../services/apprentice.service';
import { setChangeActualIdApprentice } from 'src/app/store/actions/user-menu-apprentice.action';

@Component({
  selector: 'app-details-course',
  templateUrl: './details-course.component.html',
  styleUrls: ['./details-course.component.css'],
  standalone: true,
  imports: [
    NgIf,
    StartsComponent,
    AccordionComponent,
    GlobalButtonsComponent,
    CommonModule,
    UpperCasePipe,
  ],
})
export class DetailsCourseComponent implements OnInit {
  dataCourse?: AllCourses;
  objetives: string[] = [];
  idUser: number = NaN;

  suscription: Subscription[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private store: Store<AppState>,
    private aprenticeserice: ApprenticeService
  ) {}

  videoUrl: SafeResourceUrl;

  ngOnInit() {
    const suscruption1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.dataCourse = data.dataCourseSelected;
        data.dataCourseSelected?.CourseObjectives.forEach((objetive) => {
          this.objetives.push(objetive.objective_text);
        });
      });

    const suscruption2 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        this.idUser = data.dataUserRegister?.id_user!;
      });

    this.suscription.push(suscruption1);
    this.suscription.push(suscruption2);

    const codigoInsercion = 'cSOG5yXxR-A?si=Yf1y-zHBPTPTIxud'; // Reemplaza con tu código de inserción
    const url = `https://www.youtube.com/embed/${codigoInsercion}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  handleClickBuyNow(idCourse: number) {
    const suscruption3 = this.aprenticeserice
      .setAddCardShop(this.idUser, idCourse)
      .subscribe((res) => {
        if (!res) return;
        this.aprenticeserice.getCarShop(this.idUser);
        this.store.dispatch(setChangeActualIdApprentice({ value: 9 }));
      });
    this.suscription.push(suscruption3);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
