import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgFor } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { MyCourseInfo } from '../../interfaces';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css'],
  standalone: true,
  imports: [NgFor, DecimalPipe, RouterLink],
})
export class MyCoursesComponent implements OnInit {
  myCourses: MyCourseInfo[] = [];

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.store.select(selectApprentice).subscribe((data) => {
      this.myCourses = data.myCourses;
    });
  }

  handleNavidate(course: MyCourseInfo) {
    //In this seccion the ID has to be provrder backend

    const idSubModuleSelecte: number = course.submodule.id_submodule;

    this.router.navigate([
      `user-apprentice/course-evaluation/${course.id_course}/training-video/${idSubModuleSelecte}`,
    ]);
  }
}
