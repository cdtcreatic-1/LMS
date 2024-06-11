import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { ApprenticeService } from '../../../services/apprentice.service';
import { AllCourses } from '../../../interfaces';
import { Subscription } from 'rxjs';
import {
  setChangeActualIdApprentice,
  setCourseSelected,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-courses',
  templateUrl: './new-courses.component.html',
  styleUrls: ['./new-courses.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe, GlobalButtonsComponent],
})
export class NewCoursesComponent implements OnInit, OnDestroy {
  dataCourse: AllCourses[] = [];

  suscription: Subscription = new Subscription();

  constructor(
    private apprenticeService: ApprenticeService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.suscription = this.apprenticeService
      .getNotificationLearner('course_recent')
      .subscribe((res) => {
        if (!res) return;
        this.dataCourse = res;
      });
  }

  detailCourse(course: AllCourses) {
    if (course.is_purchasable) {
      this.store.dispatch(setCourseSelected({ data: course }));
      this.store.dispatch(setChangeActualIdApprentice({ value: 7 }));
      return;
    }
    const idSubModuleSelecte: number = course.submodules[0].id_submodule;
    this.router.navigate([
      `user-apprentice/course-evaluation/${course.id_course}/training-video/${idSubModuleSelecte}`,
    ]);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
