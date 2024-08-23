import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { ApprenticeService } from '../../services/apprentice.service';
import { Subscription } from 'rxjs';
import {
  selectApprentice,
  selectDataShared,
} from 'src/app/store/selectors/global.selector';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { AllCourses } from '../../interfaces';
import { Router } from '@angular/router';
import {
  setChangeActualIdApprentice,
  setCourseSelected,
} from 'src/app/store/actions/user-menu-apprentice.action';

@Component({
  selector: 'app-course-recomender',
  templateUrl: './course-recomender.component.html',
  styleUrls: ['./course-recomender.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, GlobalButtonsComponent],
})
export class CourseRecomenderComponent implements OnInit, OnDestroy {
  suscription: Subscription[] = [];
  dataCourse: AllCourses[] = [];
  idUser: number = NaN;

  constructor(
    private apprenticeService: ApprenticeService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    const suscription1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        if (data.dataRecommendedCourses.length === 0) {
          this.apprenticeService.getRecommendedCourse();
        }
        this.dataCourse = data.dataRecommendedCourses;
      });

    const suscruption2 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        this.idUser = data.dataUserRegister?.id_user!;
      });

    this.suscription.push(suscription1);
    this.suscription.push(suscruption2);
  }

  detailCourse(course: AllCourses) {
    this.store.dispatch(setCourseSelected({ data: course }));
    this.store.dispatch(setChangeActualIdApprentice({ value: 7 }));
  }

  addCarShop(idCourse: number) {
    const suscruption3 = this.apprenticeService
      .setAddCardShop(this.idUser, idCourse)
      .subscribe((res) => {
        if (!res) return;
        this.apprenticeService.getCarShop(this.idUser);
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
    this.suscription.forEach((suscription) => suscription.unsubscribe());
  }
}
