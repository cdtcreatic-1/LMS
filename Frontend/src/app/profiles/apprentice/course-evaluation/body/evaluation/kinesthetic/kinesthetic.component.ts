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
 

onDrop(event: DragEvent, dropArea: 'right' | 'left') {
    event.preventDefault();
    const answerId = event.dataTransfer?.getData('text');

    if (answerId) {
       
        if (dropArea === 'right') {
            this.handlePassAnswers();
        } else if (dropArea === 'left') {
            this.handleBackAnswers();
            
        }
    }
    this.draggedAnswer = null;
}
  onDragEnd(event: DragEvent) {
    const target = event.target as HTMLElement;
    target.classList.remove('dragging'); // Elimina la clase de arrastre al finalizar
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
  handlePassAnswers() {/**aqui se puede hacer el cambio */
    const answersTrue = this.questionSelected.SubmoduleAnswers.filter(
      (answer) => answer.isSelected
    );

    if (answersTrue.length === 0) {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor, seleccione al menos una respuesta',
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
  handleClickSelecAnswer(idAnswer: number) {/* pasarlo como metodo a la verificacion de arriba*/ 
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
          message: 'Por favor, seleccione al menos una respuesta',
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

  handleBuildData() {
    const suscription2 = this.store
      .select(selectApprentice)
     .subscribe((data) => {
        if (data.dataAllAnswers.length > 0) {
          this.dataAnswers = data.dataAllAnswers[this.actualId - 1];
          const diferentes: SubmoduleAnswer[] = [];
          this.questionSelected.SubmoduleAnswers.map((item) => {
            const resfilter = this.dataAnswers.find(
              (res) => res.id_answer === item.id_answer
            );
            if (!resfilter) {
              diferentes.push(item);
            }
          });

          this.questionSelected = {
           ...this.questionSelected,
            SubmoduleAnswers: diferentes,
          };
        }
      });

    this.suscription.add(suscription2);
  }

  

  handleBack() {
    if (this.actualId === 1) return;
    this.actualId -= 1;
    this.handleSelectQuestion();
     this.handleBuildData();
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
