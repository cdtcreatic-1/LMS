import { Component, Input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  setCurrentIdTypeLearning,
  setItemSelectedQuestion,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';
import { DataStepsApprentice } from '../interfaces';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ErrorsFormsComponent } from 'src/app/shared/errors-forms/errors-forms.component';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';

@Component({
  selector: 'app-multi-form-learning',
  templateUrl: './multi-form-learning.component.html',
  styleUrls: ['./multi-form-learning.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ErrorsFormsComponent, GlobalButtonsComponent],
})
export class MultiFormLearningComponent {
  @Input() dataStep: DataStepsApprentice;
  @Input() actualStep: number;
  @Input() numberSteps: number;

  validatorForm = signal<boolean>(true);

  constructor(private store: Store<AppState>) {}
  
  handleClickChecked(id: number) {
    this.store.dispatch(
      setItemSelectedQuestion({
        idQuestion: this.dataStep.id_question,
        idAnswer: id,
      })
    );
    this.validatorForm.set(true);
  }

  handleBack() {
    this.store.dispatch(
      setCurrentIdTypeLearning({ value: this.actualStep - 1 })
    );
  }

  handleNext() {
    const res = this.dataStep.answers.find((item) => item.isSelected);

    if (!res) {
      this.validatorForm.set(false);
      return;
    }

    this.store.dispatch(
      setCurrentIdTypeLearning({ value: this.actualStep + 1 })
    );
  }
}
