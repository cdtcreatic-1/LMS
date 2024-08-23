import { Component, OnInit } from '@angular/core';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { AllCourses } from '../../../interfaces';
import { Subscription } from 'rxjs';
import { ApprenticeService } from '../../../services/apprentice.service';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import {
  setChangeActualIdApprentice,
  setCourseSelected,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-old-courses',
  templateUrl: './old-courses.component.html',
  styleUrls: ['./old-courses.component.css'],
  standalone: true,
  imports: [NgFor, GlobalButtonsComponent],
})
export class OldCoursesComponent implements OnInit {
  dataCourse: AllCourses[] = [];

  suscription: Subscription = new Subscription();

  constructor(
    private apprenticeService: ApprenticeService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.suscription = this.apprenticeService
      .getNotificationLearner('get_recently_purchases')
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
