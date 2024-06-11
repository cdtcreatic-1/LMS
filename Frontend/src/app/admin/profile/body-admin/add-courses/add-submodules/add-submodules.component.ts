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
  selector: 'app-add-submodules',
  templateUrl: './add-submodules.component.html',
  styleUrls: ['./add-submodules.component.css'],
  standalone: true,
  imports: [NgFor, AddIconMessageComponent, RouterLink],
})
export class AddSubmodulesComponent implements OnInit, OnDestroy {
  idAction: number = NaN;
  idModule: number = NaN;
  dataSubmodules: Submodule[] = [];

  suscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private addCourseService: AddCoursesService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    let idModule = this.route.snapshot.paramMap.get('idmodule');
    this.idModule = parseInt(idModule!);

    const suscription1 = this.store
      .select(selectAdminAddCourses)
      .subscribe((data) => {
        this.idAction = data.idAction;
      });

    const suscription2 = this.addCourseService
      .getAllSubModules(this.idModule)
      .subscribe((res) => {
        this.dataSubmodules = res.submodules;
      });

    this.suscription.add(suscription1);
    this.suscription.add(suscription2);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
