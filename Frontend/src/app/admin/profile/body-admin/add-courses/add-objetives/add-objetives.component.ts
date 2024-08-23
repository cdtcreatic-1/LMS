import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddCoursesService } from '../services/add-courses.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectAdminAddCourses } from 'src/app/store/selectors/global.selector';
import { Objetives, Skill } from '../interfaces';
import { Subscription } from 'rxjs';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';

@Component({
  selector: 'app-add-objetives',
  templateUrl: './add-objetives.component.html',
  styleUrls: ['./add-objetives.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    IonicModule,
    RouterLink,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    IonicModule,
  ],
})
export class AddObjetivesComponent implements OnInit, OnDestroy {
  isAddObjetive: boolean = false;
  isAddSkill: boolean = false;
  idCourse: number = NaN;
  idAction: number = NaN;

  dataObjetives: Objetives[] = [];
  dataSkills: Skill[] = [];

  formAdd: FormGroup = this.fb.group({
    addObjetive: [''],
    addSkill: [''],
  });

  messageError: string =
    'Se puede usar número y letras, tildes, signos de puntuación básicos como la coma (,), el punto (.), el guion (-), el guion bajo (_), la barra (/), el punto y coma (;), el dos puntos (:), con un mínimo de 20 y máximo de 500 caracteres';

  suscription: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private addCourseService: AddCoursesService,
    private router: Router
  ) {}

  ngOnInit() {
    const suscription1 = this.store
      .select(selectAdminAddCourses)
      .subscribe((data) => {
        this.idAction = data.idAction;
        this.idCourse = data.idCourseSelected;
      });

    this.handleGetObjetives();
    this.handleGetSkills();

    this.suscription.push(suscription1);
  }

  handleClickOpenCloseInputAdd(idAdd: number, idAction: number) {
    if (idAdd === 1) {
      if (idAction === 1) {
        this.isAddObjetive = true;
      } else {
        this.isAddObjetive = false;
      }
    } else {
      if (idAction === 1) {
        this.isAddSkill = true;
      } else {
        this.isAddSkill = false;
      }
    }
  }

  validatorFields(field: string) {
    return (
      this.formAdd.controls[field].errors &&
      this.formAdd.controls[field].touched
    );
  }

  // Objetives Flow

  handleGetObjetives() {
    const suscription2 = this.addCourseService
      .getObjetives(this.idCourse)
      .subscribe((res) => {
        this.dataObjetives = res.objectives;
      });

    this.suscription.push(suscription2);
  }

  AddObjetive() {
    if (!this.formAdd.value['addObjetive']) {
      this.AddSkill();
      return;
    }
    if (this.formAdd.get('addObjetive')?.invalid) {
      this.store.dispatch(
        setIsErrorMessage({
          message: this.messageError,
        })
      );
      return;
    }

    const suscription3 = this.addCourseService
      .setAddObjetive(this.idCourse, this.formAdd.value['addObjetive'])
      .subscribe((res) => {
        if (!res) return;
        this.formAdd.get('addObjetive')?.reset();
        this.handleGetObjetives();
      });

    this.suscription.push(suscription3);
  }

  deleteObjetive(idObjetive: number) {
    const suscription4 = this.addCourseService
      .deleteObjetive(idObjetive)
      .subscribe((res) => {
        if (!res) return;
        this.handleGetObjetives();
      });

    this.suscription.push(suscription4);
  }

  /////////////////// Skills Flow

  handleGetSkills() {
    const suscription = this.addCourseService
      .getSkills(this.idCourse)
      .subscribe((res) => {
        this.dataSkills = res.skills;
      });

    this.suscription.push(suscription);
  }

  AddSkill() {
    if (!this.formAdd.value['addSkill']) {
      this.AddObjetive();
      return;
    }
    if (this.formAdd.get('addSkill')?.invalid) {
      this.store.dispatch(
        setIsErrorMessage({
          message: this.messageError,
        })
      );
      return;
    }

    const suscription3 = this.addCourseService
      .setAddSkill(this.idCourse, this.formAdd.value['addSkill'])
      .subscribe((res) => {
        if (!res) return;
        this.formAdd.get('addSkill')?.reset();
        this.handleGetSkills();
      });

    this.suscription.push(suscription3);
  }

  deleteSkill(idSkill: number) {
    const suscription4 = this.addCourseService
      .deleteSkill(idSkill)
      .subscribe((res) => {
        if (!res) return;
        this.handleGetSkills();
      });

    this.suscription.push(suscription4);
  }

  // Submir form button

  handleNext() {
    if (this.dataObjetives.length === 0 || this.dataSkills.length === 0) {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor, anexar por lo menos un objetivo y una habilidad',
        })
      );
      return;
    }

    this.router.navigate([
      `/admin/profile/add-courses/add/action=${this.idAction}/${this.idCourse}/add-modules`,
    ]);
  }

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }
}
