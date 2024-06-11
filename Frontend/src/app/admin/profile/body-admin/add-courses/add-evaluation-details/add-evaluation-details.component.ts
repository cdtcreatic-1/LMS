import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddIconMessageComponent } from 'src/app/admin/shared/add-icon-message/add-icon-message.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { AddCoursesService } from '../services/add-courses.service';
import {
  Answers,
  AnswersLocal,
  DataQuestions,
  DataRequestQuestionAnswers,
  ResponseGetQuestionAnswers,
} from '../interfaces';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { selectAdminAddCourses } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-add-evaluation-details',
  templateUrl: './add-evaluation-details.component.html',
  styleUrls: ['./add-evaluation-details.component.css'],
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgIf,
    NgFor,
    MatTooltipModule,
    IonicModule,
    RouterLink,
    AddIconMessageComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AddEvaluationDetailsComponent implements OnInit, OnDestroy {
  idModule: number = NaN;
  idSubModule: number = NaN;
  idCourse: number = NaN;

  idQuestion: number = 1;
  idQuestionRef: number = 1;
  maxAnswers: number = 6;
  maxQuestions: number = 4;

  isEdit: boolean = false;
  isFirstReload: boolean = true;

  questions: DataQuestions[] = [];
  questionSelected: DataQuestions;

  formQuestion: FormGroup[] = [
    this.fb.group({
      question: [''],
      Respuesta1: [''],
      check1: [''],
    }),
  ];

  formSelected: FormGroup;

  suscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private addCourseService: AddCoursesService,
    private router: Router
  ) {
    this.formSelected = this.formQuestion[0];
  }

  ngOnInit() {
    let idModule = this.route.snapshot.paramMap.get('idmodule');
    this.idModule = parseInt(idModule!);

    let idSubModule = this.route.snapshot.paramMap.get('idsubmodule');
    this.idSubModule = parseInt(idSubModule!);

    const suscription1 = this.store
      .select(selectAdminAddCourses)
      .subscribe((data) => {
        this.idCourse = data.idCourseSelected;
      });

    this.suscription.add(suscription1);

    if (this.idSubModule > 0) {
      const suscription = this.addCourseService
        .getQuestionAnswers(this.idSubModule)
        .subscribe((res) => {
          if (res.questions.length > 0) {
            this.handleBuildData(res);
            this.isEdit = true;
          } else {
            this.handleBuildWithOut();
          }
        });

      this.suscription.add(suscription);
    } else {
      this.handleBuildWithOut();
    }
  }

  // Build data of backend provider

  handleBuildData(data: ResponseGetQuestionAnswers) {
    const newFormQuestion: FormGroup[] = [];

    data.questions.forEach((question, index) => {
      const newFormSelected: FormGroup = this.fb.group({
        question: [''],
        Respuesta1: [''],
        check1: [''],
      });

      const answerRef: AnswersLocal[] = [];

      newFormSelected.get('question')?.setValue(question.question_content);

      data.answers[index].forEach((answer, indexAnswer) => {
        if (indexAnswer === 0) {
          newFormSelected.get(`Respuesta1`)?.setValue(answer.answers_content);
          newFormSelected.get(`check1`)?.setValue(answer.answers_validity);
        } else {
          newFormSelected.addControl(
            `Respuesta${indexAnswer + 1}`,
            new FormControl([])
          );
          newFormSelected
            .get(`Respuesta${indexAnswer + 1}`)
            ?.setValue(answer.answers_content);

          newFormSelected.addControl(
            `check${indexAnswer + 1}`,
            new FormControl([])
          );
          newFormSelected
            .get(`check${indexAnswer + 1}`)
            ?.setValue(answer.answers_validity);
        }

        answerRef.push({
          id: indexAnswer + 1,
          checked: answer.answers_validity,
          idAnswer: answer.id_answer,
          key: `Respuesta${indexAnswer + 1}`,
          keyCheck: `check${indexAnswer + 1}`,
          value: answer.answers_content,
        });
      });

      newFormQuestion.push(newFormSelected);

      const questionRef = {
        id: index + 1,
        idQuestion: question.id_question,
        isSelected: index === 0 ? true : false,
        question: question.question_content,
        name: `Pregunta ${index + 1}`,
        answers: answerRef,
      };

      this.questions.push(questionRef);
      if (index === 0) {
        this.questionSelected = questionRef;
      }
    });

    this.formQuestion = newFormQuestion;
    this.formSelected = this.formQuestion[0];

    this.handleSelectQuestion(1);
  }

  // Buiold data with backend

  handleBuildWithOut() {
    const questionRef = {
      id: 1,
      idQuestion: NaN,
      isSelected: true,
      question: '',
      name: `Pregunta 1`,
      answers: [
        {
          id: 1,
          idAnswer: NaN,
          key: 'Respuesta1',
          value: '',
          keyCheck: 'check1',
          checked: false,
        },
      ],
    };

    this.questions.push(questionRef);
    this.questionSelected = { ...questionRef, isSelected: true };
  }

  // onchange question

  handleSelectQuestion(id: number) {
    if (!this.isFirstReload) {
      this.handleEditQuestion();
    }

    this.questions = this.questions.map((question, index) => {
      if (question.id === id) {
        this.questionSelected = question;

        this.formSelected = this.formQuestion[id - 1];

        return { ...question, isSelected: true };
      }
      return { ...question, isSelected: false };
    });

    this.isFirstReload = false;

    this.formSelected = this.formQuestion[id - 1];
  }

  handleEditQuestion() {
    if (this.questions.length === 1) return;
    const question: string = this.formSelected.value['question'];

    this.questionSelected.answers.forEach((item, index) => {
      this.questionSelected.answers[index].value =
        this.formSelected.value[`Respuesta${item.id}`];
    });

    this.questions[this.questionSelected.id - 1] = {
      ...this.questionSelected,
      question,
    };
  }

  handleAddQuestion(notAddNewQuestion?: boolean) {
    const idQuestion = this.questions.length + 1;

    const question: string = this.formSelected.value['question'];

    if (question.length === 0) {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor, digite la pregunta',
        })
      );
      return false;
    }

    if (this.questionSelected.answers.length < 2) {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor, agregar al menos dos respuestas a la pregunta',
        })
      );
      return false;
    } else {
      this.questionSelected.answers.forEach((item, index) => {
        this.questionSelected.answers[index].value =
          this.formSelected.value[`Respuesta${item.id}`];
      });

      const res = this.questionSelected.answers.filter(
        (item) => item.value.length <= 1
      );

      if (res.length > 0) {
        this.store.dispatch(
          setIsErrorMessage({
            message: 'Por favor, complete todas las respuestas',
          })
        );
        return false;
      }

      const resCheck = this.questionSelected.answers.find(
        (item) => item.checked
      );

      if (!resCheck) {
        this.store.dispatch(
          setIsErrorMessage({
            message: 'Por favor, selecciona la respuesta correcta',
          })
        );
        return false;
      }
    }

    if (this.questionSelected.id < idQuestion - 1) {
      this.handleSelectQuestion(idQuestion - 1);
      return;
    }

    // Asigned question selected into question
    this.questions[this.questions.length - 1] = this.questionSelected;

    this.questions = this.questions.map((item) => {
      if (item.isSelected) {
        return { ...item, question };
      }
      return { ...item };
    });

    if (this.questions.length === this.maxQuestions) return true;
    if (notAddNewQuestion) return true;

    const questionRef = {
      id: idQuestion,
      idQuestion: NaN,
      isSelected: true,
      question: '',
      name: `Pregunta ${idQuestion}`,
      answers: [
        {
          id: 1,
          idAnswer: NaN,
          key: 'Respuesta1',
          value: '',
          keyCheck: 'check1',
          checked: false,
        },
      ],
    };

    this.questions.push(questionRef);
    this.questionSelected = questionRef;

    this.formQuestion[this.formQuestion.length - 1] = this.formSelected;
    this.formQuestion.push(
      this.fb.group({
        question: [''],
        Respuesta1: [''],
        check1: [''],
      })
    );

    this.formSelected = this.formQuestion[this.formQuestion.length - 1];

    this.handleSelectQuestion(idQuestion);

    return true;
  }

  handleAddAnswer() {
    const idAnswer = this.questionSelected.answers.length;
    const answer: string = this.formSelected.value[`Respuesta${idAnswer}`];

    if (answer.length === 0) {
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor, digite la respuesta',
        })
      );
      return;
    }

    this.questionSelected.answers.push({
      id: idAnswer + 1,
      idAnswer: NaN,
      key: `Respuesta${idAnswer + 1}`,
      value: '',
      keyCheck: `check${idAnswer + 1}`,
      checked: false,
    });

    if (idAnswer === this.maxAnswers) return;

    this.formSelected.addControl(
      `Respuesta${idAnswer + 1}`,
      new FormControl('', [])
    );

    this.formSelected.addControl(
      `check${idAnswer + 1}`,
      new FormControl('false', [])
    );
  }

  handleCheckBox(id: number) {
    this.questionSelected.answers = this.questionSelected.answers.map(
      (item) => {
        if (item.id === id) {
          return {
            ...item,
            checked: !item.checked,
          };
        }
        return {
          ...item,
        };
      }
    );
  }

  handleSubmit() {
    if (!this.isFirstReload) {
      this.handleEditQuestion();
    }
    const resAddQuestion = this.handleAddQuestion(true);
    if (!resAddQuestion) return;

    const dataBody: DataRequestQuestionAnswers[] = [];

    this.formQuestion.forEach((formRef, index) => {
      const keys = Object.keys(formRef.controls);
      const size = (keys.length - 1) / 2;

      this.questions[index].question = formRef.value['question'];

      for (let i = 1; i <= size; i++) {
        this.questions[index].answers[i - 1].value = `${
          formRef.value[`Respuesta${i}`]
        }`;

        this.questions[index].answers[i - 1].checked = eval(
          `${formRef.value[`check${i}`]}`
        );
      }
    });

    this.questions.forEach((question, index) => {
      // if (index === this.questions.length - 1) return;
      const answers: Answers[] = [];
      question.answers.forEach((answer) => {
        if (!this.isEdit) {
          answers.push({
            answers_content: answer.value,
            answers_validity: answer.checked,
          });
        } else {
          answers.push({
            id_answer: answer.idAnswer ? answer.idAnswer : 0,
            answers_content: answer.value,
            answers_validity: answer.checked,
          });
        }
      });

      if (!this.isEdit) {
        dataBody.push({ question_content: question.question, answers });
      } else {
        dataBody.push({
          id_question: question.idQuestion ? question.idQuestion : 0,
          question_content: question.question,
          answers,
        });
      }
    });

    if (!this.isEdit) {
      this.addCourseService
        .addQuestionsAnswers(this.idSubModule, dataBody)
        .subscribe((res) => {
          if (!res) return;
          this.handleNavigateSubmodule();
        });
    } else {
      this.addCourseService
        .editQuestionsAnswers(this.idSubModule, dataBody)
        .subscribe((res) => {
          if (!res) return;
          this.handleNavigateSubmodule();
        });
    }
  }

  handleNavigateSubmodule() {
    this.router.navigate([
      `/admin/profile/add-courses/add/action=${3}/${
        this.idCourse
      }/add-submodules/${this.idModule}`,
    ]);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
