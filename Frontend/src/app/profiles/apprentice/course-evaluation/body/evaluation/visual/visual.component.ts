import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { SubmoduleAnswer, SubmoduleQuestion } from '../../../interfaces';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { ByStepsComponent } from 'src/app/shared/by-steps/by-steps.component';
import {
  setSaveAnswersSubmodule,
  setchangeIdQuestion,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { Subscription } from 'rxjs';
import { handleSpeakMessage } from 'src/app/shared/helpers';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, IonicModule, ByStepsComponent],
})
export class VisualComponent implements OnInit, OnDestroy {
  dataQuestion: SubmoduleQuestion[] = [];
  questionSelected: SubmoduleQuestion;
  dataAnswers: SubmoduleAnswer[] = [];

  actualId: number = 1;
  maxLengthQuestion: number = 1;

  suscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    const suscription1 = this.store
      .select(selectApprentice)
      .subscribe((data) => {
        if (data.dataQuestionAnswers) {
          this.dataQuestion = data.dataQuestionAnswers.SubmoduleQuestions;
          this.maxLengthQuestion =
            data.dataQuestionAnswers.SubmoduleQuestions.length;
          this.handleSelectQuestion();
        }

        if (data.dataAllAnswers.length > 0) {
          this.dataAnswers = data.dataAllAnswers[this.actualId - 1];
        }
      });

    this.suscription.add(suscription1);
  }

  handleReadQuestion(message: string) {
    handleSpeakMessage(message);
  }

  // Select question

  handleSelectQuestion() {
    this.questionSelected = this.dataQuestion[this.actualId - 1];
  }

  // Build data

  // handleBuildData() {
  //   const suscription2 = this.store
  //     .select(selectApprentice)
  //     .subscribe((data) => {
  //       if (data.dataAllAnswers.length > 0) {
  //         this.dataAnswers = data.dataAllAnswers[this.actualId - 1];
  //         const diferentes: SubmoduleAnswer[] = [];
  //         this.questionSelected.SubmoduleAnswers.map((item) => {
  //           const resfilter = this.dataAnswers.find(
  //             (res) => res.id_answer === item.id_answer
  //           );
  //           if (!resfilter) {
  //             diferentes.push(item);
  //           }
  //         });

  //         this.questionSelected = {
  //           ...this.questionSelected,
  //           SubmoduleAnswers: diferentes,
  //         };
  //       }
  //     });

  //   this.suscription.add(suscription2);
  // }

  // List option

  handleClickSelectQuestion(idAnswer: number) {
    const newDataAnswers = this.questionSelected.SubmoduleAnswers.map(
      (answer) => {
        if (answer.id_answer === idAnswer) {
          return { ...answer, isSelected: !answer.isSelected };
        }
        return { ...answer };
      }
    );
    this.questionSelected = {
      ...this.questionSelected,
      SubmoduleAnswers: newDataAnswers,
    };
  }

  handlePassAnswers() {
    const answersTrue = this.questionSelected.SubmoduleAnswers.filter(
      (answer) => answer.isSelected
    );

    if (answersTrue.length === 0) {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor, seleccione almenos una respuesta',
        })
      );
      return;
    }

    answersTrue.forEach((answers) => {
      this.questionSelected = {
        ...this.questionSelected,
        SubmoduleAnswers: this.questionSelected.SubmoduleAnswers.filter(
          (item) => item.id_answer !== answers.id_answer
        ),
      };

      this.dataAnswers.push({
        ...answers,
        isSelected: false,
      });
    });
  }

  // List option true

  handleClickSelectAnswers(idAnswer: number) {
    const newDataAnswers = this.dataAnswers.map((answer) => {
      if (answer.id_answer === idAnswer) {
        return { ...answer, isSelected: !answer.isSelected };
      }
      return { ...answer };
    });
    this.dataAnswers = newDataAnswers;
  }

  handleBackAnswers() {
    const answersTrue = this.dataAnswers.filter((answer) => answer.isSelected);

    if (answersTrue.length === 0) {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor, seleccione almenos una respuesta',
        })
      );
      return;
    }

    answersTrue.map((answers) => {
      this.dataAnswers = this.dataAnswers.filter(
        (item) => item.id_answer !== answers.id_answer
      );
      this.questionSelected.SubmoduleAnswers.push({
        ...answers,
        isSelected: false,
      });
    });
  }

  handleBack() {
    if (this.actualId === 1) return;
    this.actualId -= 1;
    // this.handleSelectQuestion();
    // this.handleBuildData();
  }

  handleSubmit() {
    if (this.dataAnswers.length === 0) {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor, selecciones la(s) respuesta(s) correcta',
        })
      );
      return;
    }

    this.store.dispatch(setSaveAnswersSubmodule({ data: this.dataAnswers }));

    this.dataAnswers = [];
    this.actualId += 1;

    if (this.actualId > this.maxLengthQuestion) {
      this.store.dispatch(setchangeIdQuestion({ id: 2 }));
      return;
    }

    this.handleSelectQuestion();
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
