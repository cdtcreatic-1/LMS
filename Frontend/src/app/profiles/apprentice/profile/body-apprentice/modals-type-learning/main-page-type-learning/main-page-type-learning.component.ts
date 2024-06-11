import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { DataStepsApprentice } from '../interfaces';
import { FinishLearningComponent } from '../finish-learning/finish-learning.component';
import { MultiFormLearningComponent } from '../multi-form-learning/multi-form-learning.component';
import { InstructionLearningComponent } from '../instruction-learning/instruction-learning.component';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-main-page-type-learning',
    templateUrl: './main-page-type-learning.component.html',
    styleUrls: ['./main-page-type-learning.component.css'],
    standalone: true,
    imports: [
        NgIf,
        InstructionLearningComponent,
        MultiFormLearningComponent,
        FinishLearningComponent,
    ],
})
export class MainPageTypeLearningComponent implements OnDestroy {
  actualId: number = 1;

  dataStep: DataStepsApprentice[] = [];

  suscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) {
    const suscruption1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        this.actualId = data.actualIdTypeLearning;
        this.dataStep = data.dataQuestion;
      });

    this.suscription.add(suscruption1);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
