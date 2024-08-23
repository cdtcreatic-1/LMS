import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BASE_URL } from 'src/app/shared/constants';
import { AppState } from 'src/app/store/app.state';
import {
  AllCourses,
  AllSkills,
  AnswerQuery,
  CoursePurchaseData,
  QuerySkills,
  RequestPurchase,
  ResponseChatBoot,
  ResponseGetCarCourses,
  ResponseGetMyCourses,
  ResponsePurcahse,
} from '../interfaces';
import {
  setAllCourses,
  setDataCarShop,
  setDataChatBoot,
  setDataMiCourses,
  setRecommendedCourses,
} from 'src/app/store/actions/user-menu-apprentice.action';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { Observable, Subject } from 'rxjs';
import { setIsLoading } from 'src/app/store/actions/loading.actions';
import { reponseInvalid } from 'src/app/store/constants';
import { SharedService } from 'src/app/shared/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class ApprenticeService {
  private _isErrorAddCarShop$ = new Subject<boolean>();
  private _isErrorTypeLearning$ = new Subject<boolean>();
  private _isErrorTypeSkills$ = new Subject<boolean>();
  private _isErrorPuchase$ = new Subject<ResponsePurcahse | null>();
  private _isErrorChatBoot$ = new Subject<boolean>();
  private _isErrorSkills$ = new Subject<AllSkills[] | null>();
  private _isErrorNotification$ = new Subject<AllCourses[] | null>();

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private sharedService: SharedService
  ) {}

  getAllCourses() {
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId');
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<AllCourses[]>(BASE_URL + 'get_all_courses/' + `${idUser}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this.store.dispatch(setAllCourses({ data: response }));
        },
        error: (error) => {
          this.store.dispatch(
            setIsErrorMessage({
              message: 'Error al cargar los cursos, intentelo más tarde',
            })
          );
        },
      });
  }

  getCarShop(idBuyer: number) {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<ResponseGetCarCourses>(BASE_URL + 'cart_course/' + `${idBuyer}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this.store.dispatch(setDataCarShop({ data: response.cartCourses }));
        },
        error: (error) => {
          this.store.dispatch(
            setIsErrorMessage({
              message: 'Error al cargar carro de compras',
            })
          );
        },
      });
  }

  getMyCourses(idUser: number) {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<ResponseGetMyCourses>(BASE_URL + 'user_course/' + `${idUser}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this.store.dispatch(setDataMiCourses({ data: response.data }));
        },
        error: (error) => {
          this.store.dispatch(
            setIsErrorMessage({
              message: 'Error al cargar mis cursos',
            })
          );
        },
      });
  }

  setAddCardShop(idBuyer: number, idCourse: number): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      id_buyer: idBuyer,
      id_course: idCourse,
    };

    this.http
      .post(BASE_URL + 'cart_course', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._isErrorAddCarShop$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          console.log({ error });
          this._isErrorAddCarShop$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: 'El curso ya se encuentra en el carro de compras',
            })
          );
        },
      });
    return this._isErrorAddCarShop$.asObservable();
  }

  deleteCardShop(idBuyer: number, idCourse: number): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .delete(BASE_URL + 'cart_course/' + `${idBuyer}/${idCourse}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._isErrorAddCarShop$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          console.log({ error });
          this._isErrorAddCarShop$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: 'No se puede eliminar el curso, intentalo más tarde',
            })
          );
        },
      });
    return this._isErrorAddCarShop$.asObservable();
  }

  setPurchaseApprentice(
    coursePurchaseData: CoursePurchaseData[]
  ): Observable<ResponsePurcahse | null> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body: RequestPurchase = {
      shipping_address: '123 Main St, City',
      additional_notes: 'Additional notes for the purchase',
      id_shipping_option: 1,
      courseData: coursePurchaseData,
    };

    this.http
      .post<ResponsePurcahse>(BASE_URL + 'purchase_course', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._isErrorPuchase$.next(response);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorPuchase$.next(null);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: error.message,
            })
          );
        },
      });
    return this._isErrorPuchase$.asObservable();
  }

  setParseReferenceApprentice(reference: string): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      reference,
    };
    this.http
      .post(BASE_URL + 'parse_ref_course', body, { headers: myHeaders })
      .subscribe({
        next: () => {
          this.store.dispatch(setIsLoading({ value: false }));
          return this._isErrorAddCarShop$.next(true);
        },
        error: () => {
          this.store.dispatch(setIsLoading({ value: false }));
          return this._isErrorAddCarShop$.next(false);
        },
      });

    return this._isErrorAddCarShop$.asObservable();
  }

  // Chat boot

  setChatBoot(question: string, courseName: string): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'make_a_chatbot_query2',
      question,
      course_name: courseName.toLowerCase(),
    };

    this.http
      .post<ResponseChatBoot>(
        BASE_URL + 'consume_learner_profile_data_microservice',
        body,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this.store.dispatch(
            setDataChatBoot({
              data: {
                value: !response.answer ? reponseInvalid : response.answer,
                id: 2,
              },
            })
          );
          this._isErrorChatBoot$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          console.log({ error });
          this._isErrorChatBoot$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: `${error.message}`,
            })
          );
        },
      });
    return this._isErrorChatBoot$.asObservable();
  }

  // Type learnings

  setTypeLearnings(dataAnswers: AnswerQuery[]): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'estimate_learning_style',
      id_user: idUser,
      answers: dataAnswers,
    };
    this.http
      .post(BASE_URL + 'consume_learner_profile_data_microservice', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: () => {
          this.sharedService.getDataRegister();
          this.store.dispatch(setIsLoading({ value: false }));
          return this._isErrorTypeLearning$.next(true);
        },
        error: (error) => {
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: `${error.message}`,
            })
          );
          return this._isErrorTypeLearning$.next(false);
        },
      });

    return this._isErrorTypeLearning$.asObservable();
  }

  // Get All skills

  getSkills(): Observable<AllSkills[] | null> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<AllSkills[]>(BASE_URL + 'skills', {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this.store.dispatch(setIsLoading({ value: false }));
          return this._isErrorSkills$.next(response);
        },
        error: (error) => {
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: `${error.message}`,
            })
          );
          return this._isErrorSkills$.next(null);
        },
      });
    return this._isErrorSkills$.asObservable();
  }

  setSkillsUser(dataSkills: QuerySkills[]): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      id_user: idUser,
      data: dataSkills,
    };
    this.http
      .post(BASE_URL + 'user_skill_preferences_arr', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: () => {
          this.sharedService.getDataRegister();
          this.store.dispatch(setIsLoading({ value: false }));
          return this._isErrorTypeSkills$.next(true);
        },
        error: (error) => {
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: `${error.message}`,
            })
          );
          return this._isErrorTypeSkills$.next(false);
        },
      });

    return this._isErrorTypeSkills$.asObservable();
  }

  // Recomended Course

  getRecommendedCourse() {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId');
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<AllCourses[]>(
        BASE_URL + 'get_courses_by_skill_user/' + `${idUser}`,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this.store.dispatch(setRecommendedCourses({ data: response }));
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this.store.dispatch(
            setIsErrorMessage({
              message: 'Error al cargar los cursos, intentelo más tarde',
            })
          );
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
  }

  getNotificationLearner(route: string): Observable<AllCourses[] | null> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId');
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<AllCourses[]>(BASE_URL + `${route}/${idUser}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this.store.dispatch(setIsLoading({ value: false }));
          return this._isErrorNotification$.next(response);
        },
        error: (error) => {
          this.store.dispatch(
            setIsErrorMessage({
              message: 'Error al cargar los cursos, intentelo más tarde',
            })
          );
          this.store.dispatch(setIsLoading({ value: false }));
          return this._isErrorNotification$.next(null);
        },
      });

    return this._isErrorNotification$.asObservable();
  }
}
