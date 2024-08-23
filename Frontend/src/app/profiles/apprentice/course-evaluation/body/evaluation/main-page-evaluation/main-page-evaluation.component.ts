import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { VisualComponent } from '../visual/visual.component';
import { AuditoryComponent } from '../auditory/auditory.component';
import { KinestheticComponent } from '../kinesthetic/kinesthetic.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  selectApprentice,
  selectDataShared,
} from 'src/app/store/selectors/global.selector';
import { CourseEvaluationService } from '../../../services/course-evaluation.service';
import { SendAnswersComponent } from '../send-answers/send-answers.component';

@Component({
  selector: 'app-main-page-evaluation',
  templateUrl: './main-page-evaluation.component.html',
  styleUrls: ['./main-page-evaluation.component.css'],
  standalone: true,
  imports: [
    NgIf,
    VisualComponent,
    AuditoryComponent,
    KinestheticComponent,
    SendAnswersComponent,
  ],
})
export class MainPageEvaluationComponent implements OnInit, OnDestroy {
  typeLearning: number = 3;
  idEvaluationQuestion: number = 1;
  idSubmodule: number;

  suscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private courseEvaluationService: CourseEvaluationService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    let idSubModule = this.route.snapshot.paramMap.get('idSubmodule');
    this.idSubmodule = parseInt(idSubModule!);
    this.courseEvaluationService.getAllQuestionsAnswers(parseInt(idSubModule!));

    const suscription1 = this.store
      .select(selectDataShared)
      .subscribe((data) => {
        switch (data.dataUserRegister?.learning_style!) {
          case 'visual':
            this.typeLearning = 1;
            break;
          case 'auditivo':
            this.typeLearning = 2;
            break;
          case 'cinestesico':
            this.typeLearning = 3;
            break;
          default:
            break;
        }
      });

    const suscription2 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.idEvaluationQuestion = data.idSendEvaluation;
      });

    this.suscription.add(suscription1);
    this.suscription.add(suscription2);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
