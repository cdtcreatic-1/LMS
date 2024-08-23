import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { BASE_URL } from 'src/app/shared/constants';
import { setIsLoading } from 'src/app/store/actions/loading.actions';
import { AppState } from 'src/app/store/app.state';
import {
  DataAnswers,
  DataPercentageTable,
  GeneratedCertificated,
  ResponseDataQuestionAnswers,
  ResponseGetAllInfoCourse,
  ResponseGetAllQuestionsAnswers,
} from '../interfaces';
import {
  setDataModules,
  setDataQuestionAnsers,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';

@Injectable({
  providedIn: 'root',
})
export class CourseEvaluationService {
  private _isSendEvaluation$ = new Subject<boolean>();
  private _questionAnswers$ = new Subject<ResponseDataQuestionAnswers>();
  private _isPercentageCourse$ = new Subject<DataPercentageTable>();
  private _isCertificateCourse$ = new Subject<any>();

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  getAllInfoCourse(idCourse: number) {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<ResponseGetAllInfoCourse>(
        BASE_URL +
          'get_all_course_info_by_user/' +
          `${idUser}/` +
          `${idCourse}`,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this.store.dispatch(setDataModules({ data: response }));
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
  }

  getAllQuestionsAnswers(idSubmodule: number) {
    this.store.dispatch(setIsLoading({ value: true }));

    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<ResponseGetAllQuestionsAnswers>(
        BASE_URL + 'get_all_questions_and_answers/' + `${idSubmodule}`,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this.store.dispatch(setDataQuestionAnsers({ data: response }));
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
  }

  setSendAnswers(
    idSubmodule: number,
    answers: DataAnswers[]
  ): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'obtain_success_rate_of_evaluation_results',
      id_user: parseInt(idUser),
      id_submodule: idSubmodule,
      answers,
    };

    this.http
      .post(BASE_URL + 'consume_learner_profile_data_microservice', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._isSendEvaluation$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isSendEvaluation$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: `${error.message}`,
            })
          );
        },
      });
    return this._isSendEvaluation$.asObservable();
  }

  getQuestionsAnswersTrue(
    idSubmodule: number
  ): Observable<ResponseDataQuestionAnswers> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'get_user_answers',
      id_user: parseInt(idUser),
      id_submodule: idSubmodule,
    };

    this.http
      .post<ResponseDataQuestionAnswers>(
        BASE_URL + 'consume_learner_profile_data_microservice',
        body,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this._questionAnswers$.next(response);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          console.log({ error });
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: `${error.error.msg}`,
            })
          );
        },
      });
    return this._questionAnswers$.asObservable();
  }

  getPercentageCourse(idCourse: number): Observable<DataPercentageTable> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'estimate_course_progress',
      id_user: parseInt(idUser),
      id_course: idCourse,
    };

    this.http
      .post<DataPercentageTable>(
        BASE_URL + 'consume_learner_profile_data_microservice',
        body,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this._isPercentageCourse$.next(response);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: `${error.message}`,
            })
          );
        },
      });
    return this._isPercentageCourse$.asObservable();
  }

  getCertificateCourse(
    idCourse: number
  ): Observable<GeneratedCertificated | null> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'generate_course_certificate',
      id_user: parseInt(idUser),
      id_course: idCourse,
    };

    this.http
      .post<GeneratedCertificated>(
        BASE_URL + 'consume_learner_profile_data_microservice',
        body,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this._isCertificateCourse$.next(response);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isCertificateCourse$.next(null);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: `${error.error.msg}`,
            })
          );
        },
      });
    return this._isCertificateCourse$.asObservable();
  }

  downloadCertidicate(url: string, idCourse: number) {
    this.http.get(url, { responseType: 'blob' }).subscribe((response: Blob) => {
      const urlArchivo = window.URL.createObjectURL(response);
      const enlaceDescarga = document.createElement('a');
      enlaceDescarga.href = urlArchivo;
      enlaceDescarga.download = 'archivo.pdf';
      document.body.appendChild(enlaceDescarga);
      enlaceDescarga.click();
      document.body.removeChild(enlaceDescarga);
    });

    this.deleteFileResults(idCourse, 'generate_course_certificate');
  }

  deleteFileResults(idCourse: number, targetMicroservice: string) {
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'delete_file_generated_from_microservice',
      target_microservice: targetMicroservice,
      id_user: parseInt(idUser),
      id_course: idCourse,
    };

    this.http
      .post<any>(BASE_URL + 'consume_learner_profile_data_microservice', body, {
        headers: myHeaders,
      })
      .subscribe({
        error: (error) => {
          console.log({ error });
        },
      });

    return true;
  }
}
