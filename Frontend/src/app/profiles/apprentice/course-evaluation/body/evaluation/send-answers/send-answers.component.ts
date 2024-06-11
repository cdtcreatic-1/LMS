import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  setChangeIdEvaluacionFlow,
  setChangeIdEvaluation,
  setResetAnswersSubmodule,
  setchangeIdQuestion,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { DataAnswers, SubmoduleAnswer } from '../../../interfaces';
import { Subscription } from 'rxjs';
import { CourseEvaluationService } from '../../../services/course-evaluation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-answers',
  templateUrl: './send-answers.component.html',
  styleUrls: ['./send-answers.component.css'],
  standalone: true,
})
export class SendAnswersComponent implements OnInit, OnDestroy {
  @Input() idSubmodule: number;

  idCourse: number = NaN;
  dataAnswers: Array<SubmoduleAnswer[]>;
  suscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private evaluationService: CourseEvaluationService,
    private router: Router
  ) {}

  ngOnInit() {
    const suscription1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.dataAnswers = data.dataAllAnswers;
        this.idCourse = data.idCourse;
      });
    this.suscription.add(suscription1);
  }

  handleClickBack() {
    this.store.dispatch(setchangeIdQuestion({ id: 1 }));
    this.store.dispatch(setResetAnswersSubmodule());
  }

  handleSubmit() {
    const body: DataAnswers[] = [];

    this.dataAnswers.forEach((item) => {
      let arrayAnswers: number[] = [];
      item.forEach((answer) => {
        arrayAnswers.push(answer.id_answer);
      });
      body.push({ id_question: item[0].id_question, id_answer: arrayAnswers });
    });

    this.evaluationService
      .setSendAnswers(this.idSubmodule, body)
      .subscribe((res) => {
        if (!res) return;
        this.store.dispatch(setResetAnswersSubmodule());
        this.router.navigate([
          `user-apprentice/course-evaluation/${this.idCourse}/results/${this.idSubmodule}`,
        ]);
        this.evaluationService.getAllInfoCourse(this.idCourse);
        this.store.dispatch(setChangeIdEvaluacionFlow({ id: 3 }));
        this.store.dispatch(setchangeIdQuestion({ id: 1 }));
        this.store.dispatch(setChangeIdEvaluation({ value: 1 }));
      });
  }

  ngOnDestroy(): void {}
}
