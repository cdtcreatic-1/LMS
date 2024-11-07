import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SubmoduleAnswer, SubmoduleQuestion } from '../../../interfaces';
import { Subscription } from 'rxjs';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { handleSpeakMessage } from 'src/app/shared/helpers';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { ByStepsComponent } from 'src/app/shared/by-steps/by-steps.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import {
  setSaveAnswersSubmodule,
  setchangeIdQuestion,
} from 'src/app/store/actions/user-menu-apprentice.action';


@Component({
  selector: 'app-kinesthetic',
  templateUrl: './kinesthetic.component.html',
  styleUrls: ['./kinesthetic.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, IonicModule, ByStepsComponent],
})
export class KinestheticComponent implements OnInit, OnDestroy {
  dataQuestion: SubmoduleQuestion[] = [];
  questionSelected: SubmoduleQuestion;
  dataAnswers: SubmoduleAnswer[] = [];

  draggedAnswer: any;

  // Método para iniciar el arrastre
  onDragStart(event: DragEvent, answer: any) {
    this.draggedAnswer = answer;
    event.dataTransfer?.setData('text', answer.id_answer.toString());
    setTimeout(() => {
      (event.target as HTMLElement).classList.add('dragging');
    }, 0);
  }

  // Método para permitir el área de soltado
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Método para soltar y validar la respuesta si es en el área de palabras correctas
  onDrop(event: DragEvent, dropArea: 'left' | 'right') {
    event.preventDefault();
    const answerId = event.dataTransfer?.getData('text');

    if (answerId) {
      const answerToMove = this.questionSelected.SubmoduleAnswers.find(
        (answer) => answer.id_answer === Number(answerId)
      );

      if (dropArea === 'right' && answerToMove) {
        const isCorrect = this.isCorrectAnswer(answerId);

        if (isCorrect) {
          this.dataAnswers.push({
            ...answerToMove,
            isSelected: false,
          });
          this.questionSelected.SubmoduleAnswers = this.questionSelected.SubmoduleAnswers.filter(
            (answer) => answer.id_answer !== answerToMove.id_answer
          );
          alert('¡Respuesta correcta!');
        } else {
          alert('Respuesta incorrecta. Inténtalo de nuevo.');
        }
      }
      if (dropArea === 'left' && answerToMove) {
        // Mover de regreso al área de opciones
        this.dataAnswers = this.dataAnswers.filter(
          (answer) => answer.id_answer != answerToMove.id_answer
        );
      }
    }

    this.draggedAnswer = null; // Reiniciar la variable arrastrada
  }
  onDragEnd(event: DragEvent) {
    const target = event.target as HTMLElement;
    target.classList.remove('dragging'); // Eliminar la clase de arrastre al finalizar
  }

  // Validar si la respuesta es correcta
  isCorrectAnswer(answerId: string | null): boolean {
    return answerId === '1';
  }

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

  handleSelectQuestion() {
    this.questionSelected = this.dataQuestion[this.actualId - 1];
  }

  handleClickSelecAnswer(idAnswer: number) {
    const newDataAnswers = this.questionSelected.SubmoduleAnswers.map(
      (answer) => {
        if (answer.id_answer === idAnswer) {
          return {
            ...answer,
            isSelected: !answer.isSelected,
            isSelected_false: false,
          };
        }
        return { ...answer };
      }
    );

    this.questionSelected = {
      ...this.questionSelected,
      SubmoduleAnswers: newDataAnswers,
    };
  }

  handleClickSelecAnswerFalse(idAnswer: number) {
    const newDataAnswers = this.questionSelected.SubmoduleAnswers.map(
      (answer) => {
        if (answer.id_answer === idAnswer) {
          return {
            ...answer,
            isSelected_false: !answer.isSelected_false,
            isSelected: false,
          };
        }
        return { ...answer };
      }
    );

    this.questionSelected = {
      ...this.questionSelected,
      SubmoduleAnswers: newDataAnswers,
    };
  }

  handleBack() {
    if (this.actualId === 1) return;
    this.actualId -= 1;
    this.handleSelectQuestion();
    // this.handleBuildData();
  }

  handleSubmit() {
    const AnswersTrue = this.questionSelected.SubmoduleAnswers.filter(
      (res) => res.isSelected
    );

    if (AnswersTrue.length === 0) {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor, selecciones la(s) respuesta(s) correcta',
        })
      );
      return;
    }

    this.store.dispatch(setSaveAnswersSubmodule({ data: AnswersTrue }));

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
