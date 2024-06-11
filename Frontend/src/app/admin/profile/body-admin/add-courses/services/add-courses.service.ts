import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BASE_URL } from 'src/app/shared/constants';
import {
  DataModule,
  DataRequestQuestionAnswers,
  ResponseAllCourses,
  ResponseGetAllModules,
  ResponseGetAllSubModules,
  ResponseGetCourse,
  ResponseGetEvaluation,
  ResponseGetObjetives,
  ResponseGetQuestionAnswers,
  ResponseGetSkills,
  Submodule,
} from '../interfaces';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setAllCourses } from 'src/app/store/actions/admin-add-course.actions';
import { setIsLoading } from 'src/app/store/actions/loading.actions';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';

@Injectable({
  providedIn: 'root',
})
export class AddCoursesService {
  private _isErrorAddCourse$ = new Subject<boolean>();
  private _isErrorAddCoursePOST$ = new Subject<number>();
  private _dataCourse$ = new Subject<ResponseGetCourse>();
  private _dataObjtetives$ = new Subject<ResponseGetObjetives>();
  private _dataSkills$ = new Subject<ResponseGetSkills>();
  private _dataModules$ = new Subject<ResponseGetAllModules>();
  private _dataModule$ = new Subject<DataModule>();
  private _isErrorAddModulePOST$ = new Subject<number>();
  private _dataSubModules$ = new Subject<ResponseGetAllSubModules>();
  private _dataSubModule$ = new Subject<Submodule>();
  private _isErrorAddSubModulePOST$ = new Subject<number>();
  private _dataQuestionAnswers$ = new Subject<ResponseGetQuestionAnswers>();

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  // Get all courses

  getAllCourses(): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<ResponseAllCourses[]>(BASE_URL + 'get_all_courses/' + `${idUser}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this.store.dispatch(setAllCourses({ data: response }));
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddCourse$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
    return this._isErrorAddCourse$.asObservable();
  }

  /////////////// CRUD add course//////////////////////////

  // GET

  getCourse(idCourse: number): Observable<ResponseGetCourse> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<ResponseGetCourse>(BASE_URL + 'courses/' + `${idCourse}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._dataCourse$.next(response);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          console.log();
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
    return this._dataCourse$.asObservable();
  }

  // POST

  setAddCourse(formCourse: FormData): Observable<number> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .post(BASE_URL + 'courses', formCourse, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          this._isErrorAddCoursePOST$.next(response.id_course);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddCoursePOST$.next(NaN);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: JSON.stringify(error.error.details) })
          );
        },
      });
    return this._isErrorAddCoursePOST$.asObservable();
  }

  // PUT

  setEditCourse(formCourse: FormData): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .put(BASE_URL + 'courses', formCourse, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          this._isErrorAddCourse$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddCourse$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: JSON.stringify(error.error.details) })
          );
        },
      });
    return this._isErrorAddCourse$.asObservable();
  }

  //////////////////////// CRUD add Objetives///////////////////

  // GET

  getObjetives(idCourse: number): Observable<ResponseGetObjetives> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<ResponseGetObjetives>(
        BASE_URL + 'get_objectives_by_id_course/' + `${idCourse}`,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this._dataObjtetives$.next(response);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          console.log();
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
    return this._dataObjtetives$.asObservable();
  }

  // POST

  setAddObjetive(idCourse: number, objetiveText: string): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      objective_text: objetiveText,
      id_course: idCourse,
    };

    this.http
      .post(BASE_URL + 'course_objectives', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._isErrorAddCourse$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddCourse$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: JSON.stringify(error.error.details) })
          );
        },
      });
    return this._isErrorAddCourse$.asObservable();
  }

  // DELETE

  deleteObjetive(idObjetive: number): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .delete(BASE_URL + 'course_objectives/' + `${idObjetive}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._isErrorAddCourse$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddCourse$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: JSON.stringify(error.msg) })
          );
        },
      });
    return this._isErrorAddCourse$.asObservable();
  }

  //////////////////////// CRUD add Skills///////////////////

  // GET

  getSkills(idCourse: number): Observable<ResponseGetSkills> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<ResponseGetSkills>(
        BASE_URL + 'get_skills_by_id_course/' + `${idCourse}`,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this._dataSkills$.next(response);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          console.log();
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
    return this._dataSkills$.asObservable();
  }

  // POST

  setAddSkill(idCourse: number, skillTest: string): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      id_course: idCourse,
      skill_name: skillTest,
    };

    this.http
      .post(BASE_URL + 'course_skills', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: () => {
          this._isErrorAddCourse$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddCourse$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: JSON.stringify(error.error.details),
            })
          );
        },
      });
    return this._isErrorAddCourse$.asObservable();
  }

  // DELETE

  deleteSkill(idSkill: number): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .delete(BASE_URL + 'course_skills/' + `${idSkill}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._isErrorAddCourse$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddCourse$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: JSON.stringify(error.msg) })
          );
        },
      });
    return this._isErrorAddCourse$.asObservable();
  }

  // ADD MODULE

  // GET Modules

  getAllModules(idCourse: number): Observable<ResponseGetAllModules> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<ResponseGetAllModules>(
        BASE_URL + 'get_modules_by_id_course/' + `${idCourse}`,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this._dataModules$.next(response);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
    return this._dataModules$.asObservable();
  }

  // GET Module

  getModule(idModule: number): Observable<DataModule> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<DataModule>(BASE_URL + 'modules/' + `${idModule}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._dataModule$.next(response);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
    return this._dataModule$.asObservable();
  }

  // POST

  addModule(form: FormData): Observable<number> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post(BASE_URL + 'modules', form, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          this._isErrorAddModulePOST$.next(response.id_module);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddModulePOST$.next(NaN);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: JSON.stringify(error.error.details) })
          );
        },
      });
    return this._isErrorAddModulePOST$.asObservable();
  }

  // PUT

  editModule(form: FormData): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .put(BASE_URL + 'modules', form, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._isErrorAddCourse$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddCourse$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: JSON.stringify(error.error.details) })
          );
        },
      });
    return this._isErrorAddCourse$.asObservable();
  }

  //////////// Add Submodules ////////////////

  // GET ALL

  getAllSubModules(idModule: number): Observable<ResponseGetAllSubModules> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<any>(BASE_URL + 'submodules_by_module/' + `${idModule}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          const newData: ResponseGetAllSubModules = { submodules: response };
          this._dataSubModules$.next(newData);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
    return this._dataSubModules$.asObservable();
  }

  // Get Submmodule

  getSubModule(idSubModule: number): Observable<Submodule> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<Submodule>(BASE_URL + 'submodules/' + `${idSubModule}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._dataSubModule$.next(response);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
    return this._dataSubModule$.asObservable();
  }

  // POST

  addSubModule(form: FormData): Observable<number> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post(BASE_URL + 'submodules', form, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          this._isErrorAddSubModulePOST$.next(response.id_submodule);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddSubModulePOST$.next(NaN);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: JSON.stringify(error.error.details) })
          );
        },
      });
    return this._isErrorAddSubModulePOST$.asObservable();
  }

  // PUT edit submodule

  editSubModule(form: FormData): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .put(BASE_URL + 'submodules', form, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._isErrorAddCourse$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddCourse$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: JSON.stringify(error.error.details) })
          );
        },
      });
    return this._isErrorAddCourse$.asObservable();
  }

  //////////// Add Evaluation ////////////

  // GET

  getQuestionAnswers(
    idSubModule: number
  ): Observable<ResponseGetQuestionAnswers> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<ResponseGetQuestionAnswers>(
        BASE_URL + 'submodule_question_answer/' + `${idSubModule}`,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this._dataQuestionAnswers$.next(response);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
    return this._dataQuestionAnswers$.asObservable();
  }
  //POST

  addQuestionsAnswers(
    idSubmodule: number,
    data: DataRequestQuestionAnswers[]
  ): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      id_submodule: idSubmodule,
      data,
    };

    this.http
      .post(BASE_URL + 'submodule_question_answer', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          this._isErrorAddCourse$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddCourse$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: JSON.stringify(error.error.msg) })
          );
        },
      });
    return this._isErrorAddCourse$.asObservable();
  }

  //PUT

  editQuestionsAnswers(
    idSubmodule: number,
    data: DataRequestQuestionAnswers[]
  ): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      id_submodule: idSubmodule,
      data,
    };

    this.http
      .put(BASE_URL + 'submodule_question_answer', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          this._isErrorAddCourse$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddCourse$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: JSON.stringify(error.error.details) })
          );
        },
      });
    return this._isErrorAddCourse$.asObservable();
  }
}
