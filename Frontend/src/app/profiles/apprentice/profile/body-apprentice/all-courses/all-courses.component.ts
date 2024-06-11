import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  setChangeActualIdApprentice,
  setCourseSelected,
} from 'src/app/store/actions/user-menu-apprentice.action';
import {
  selectApprentice,
  selectDataShared,
} from 'src/app/store/selectors/global.selector';
import { AllCourses, MyCourseInfo } from '../../interfaces';
import { NgFor, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { ApprenticeService } from '../../services/apprentice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, NgClass, GlobalButtonsComponent, DecimalPipe],
})
export class AllCoursesComponent implements OnDestroy {
  idUser: number = NaN;
  dataCourses: AllCourses[] = [];

  suscription: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private aprenticeserice: ApprenticeService,
    private router: Router
  ) {
    const suscruption1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.dataCourses = data.dataAllCourses;
      });

    const suscruption2 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        this.idUser = data.dataUserRegister?.id_user!;
      });

    this.suscription.push(suscruption1);
    this.suscription.push(suscruption2);
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

  detailCourse(course: AllCourses) {
    this.store.dispatch(setCourseSelected({ data: course }));
    this.store.dispatch(setChangeActualIdApprentice({ value: 7 }));
  }

  addCarShop(idCourse: number) {
    const suscruption3 = this.aprenticeserice
      .setAddCardShop(this.idUser, idCourse)
      .subscribe((res) => {
        if (!res) return;
        this.aprenticeserice.getCarShop(this.idUser);
      });
    this.suscription.push(suscruption3);
  }

  handleNavigate(course: AllCourses) {
    const idSubModuleSelecte: number = course.submodules[0].id_submodule;

    this.router.navigate([
      `user-apprentice/course-evaluation/${course.id_course}/training-video/${idSubModuleSelecte}`,
    ]);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
