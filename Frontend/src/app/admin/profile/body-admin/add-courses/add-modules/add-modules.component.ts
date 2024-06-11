import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AddIconMessageComponent } from 'src/app/admin/shared/add-icon-message/add-icon-message.component';
import { AddCoursesService } from '../services/add-courses.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectAdminAddCourses } from 'src/app/store/selectors/global.selector';
import { Subscription } from 'rxjs';
import { Modules } from '../interfaces';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-add-modules',
  templateUrl: './add-modules.component.html',
  styleUrls: ['./add-modules.component.css'],
  standalone: true,
  imports: [NgFor, AddIconMessageComponent, RouterLink],
})
export class AddModulesComponent implements OnInit, OnDestroy {
  idAction: number = NaN;
  idCourse: number = NaN;
  dataModules: Modules[] = [];

  suscription = new Subscription();

  constructor(
    private addCourseService: AddCoursesService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    const suscription1 = this.store
      .select(selectAdminAddCourses)
      .subscribe((data) => {
        this.idAction = data.idAction;
        this.idCourse = data.idCourseSelected;
      });

    const suscription2 = this.addCourseService
      .getAllModules(this.idCourse)
      .subscribe((res) => {
        this.dataModules = res.modules;
      });

    this.suscription.add(suscription1);
    this.suscription.add(suscription2);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
