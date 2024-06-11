import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { setIdActionCourse } from 'src/app/store/actions/admin-add-course.actions';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-add-courses',
  templateUrl: './main-page-add-courses.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class MainPAgeAddCoursesComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    let action: any = this.route.snapshot.paramMap.get('action');
    let idCourse: string | null =
      this.route.snapshot.paramMap.get('courseitem');
    console.log('action :id', { idCourse });

    `const ${eval(action!)};`;

    this.store.dispatch(
      setIdActionCourse({ idAction: action, idCourse: parseInt(idCourse!) })
    );

    // this.router.navigate([
    //   `/admin/profile/add-courses/add/action=${action}/${idCourse}/add-course`,
    // ]);
  }
}
