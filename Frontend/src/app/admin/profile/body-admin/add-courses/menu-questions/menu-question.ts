
import { NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddIconMessageComponent } from 'src/app/admin/shared/add-icon-message/add-icon-message.component';
import { AddCoursesService } from '../services/add-courses.service';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { selectAdminAddCourses } from 'src/app/store/selectors/global.selector';
import { Submodule } from '../interfaces';

@Component({
  selector: 'app-menu-question',
  templateUrl: './menu-question.html',
  styleUrls: ['./menu-question.css'],
  standalone: true,
  imports: [NgFor, AddIconMessageComponent, RouterLink],
})
export class AddSubmodulesComponent  {
  idAction: number = NaN;
  idModule: number = NaN;
  
  dataSubmodules: Submodule[] = [];

 //suscription = new Subscription();
  suscription: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private addCourseService: AddCoursesService,
    private store: Store<AppState>
  ) {}}