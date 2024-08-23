import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import { setOpenModalTypeLearning } from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';
import { AnswerQuery } from '../../../interfaces';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { ApprenticeService } from '../../../services/apprentice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-finish-learning',
  templateUrl: './finish-learning.component.html',
  styleUrls: ['./finish-learning.component.css'],
  standalone: true,
  imports: [GlobalButtonsComponent],
})
export class FinishLearningComponent implements OnInit, OnDestroy {
  dataTypeLearning: AnswerQuery[] = [];

  suscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private appService: ApprenticeService
  ) {}

  ngOnInit(): void {
    this.store.select(selectApprentice).subscribe((data) => {
      data.dataQuestion.forEach((item) => {
        const resTrue = item.answers.find((item) => item.isSelected);

        const body: AnswerQuery = {
          id_question: item.id_question,
          id_answer: resTrue ? resTrue.id_answer : NaN,
        };

        this.dataTypeLearning.push(body);
      });
    });
  }

  handleFinish() {
    this.store.dispatch(setOpenModalTypeLearning({ value: false }));
    this.appService.setTypeLearnings(this.dataTypeLearning);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
