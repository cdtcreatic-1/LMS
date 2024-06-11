import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddCoursesService } from '../services/add-courses.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectAdminAddCourses } from 'src/app/store/selectors/global.selector';
import { Subscription } from 'rxjs';
import { ResponseAllCourses } from '../interfaces';
import { NgFor } from '@angular/common';
import { setIdActionCourse } from 'src/app/store/actions/admin-add-course.actions';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.css'],
  standalone: true,
  imports: [IonicModule, RouterLink, NgFor],
})
export class AllCoursesComponent implements OnInit, OnDestroy {
  dataCourses: ResponseAllCourses[] = [];
  idCourseSelected: number = 0;
  routeLink: string;

  suscription = new Subscription();

  constructor(
    private addCourseService: AddCoursesService,
    private store: Store<AppState>,
    private route: Router
  ) {}

  ngOnInit() {
    this.addCourseService.getAllCourses();
    this.store.dispatch(setIdActionCourse({ idCourse: NaN, idAction: NaN }));

    const suscription1 = this.store
      .select(selectAdminAddCourses)
      .subscribe((data) => {
        this.dataCourses = data.allCourses;
        this.idCourseSelected = data.idCourseSelected
          ? data.idCourseSelected
          : 0;
      });

    this.routeLink = `../add-courses/add/action=1/${this.idCourseSelected}/add-course`;

    this.suscription.add(suscription1);
  }

  handleClickCourseAction(idCourse: number, idAction: number) {
    if (idAction === 2) {
      this.route.navigate([
        `/admin/profile/add-courses/add/action=2/${idCourse}/add-course`,
      ]);
    } else if (idAction === 3) {
      this.route.navigate([
        `/admin/profile/add-courses/add/action=3/${idCourse}/add-course`,
      ]);
    } else {
      console.log(4);
    }
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
