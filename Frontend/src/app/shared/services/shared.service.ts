import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../constants';
import {
  DataTrendFarmers,
  DataTrends,
  DataUserRegister,
  RequestChangePassword,
  ResponseBuyerTrens,
  ResponseFarmersTrends,
  ResponseUserRoles,
  ResponseVerifyToken,
} from '../interfaces';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  setDataRegisterShared,
  setUserRoles,
} from 'src/app/store/actions/shared.actions';
import { Observable, Subject } from 'rxjs';
import { setDataTrends } from 'src/app/store/actions/user-menu.actions';
import { setDataTrendsFarmer } from 'src/app/store/actions/user-menu-businessman.actions';
import { setIsLoading } from 'src/app/store/actions/loading.actions';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';

declare const ePayco: any;

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _isErrorGetRegister$ = new Subject<number>();
  private _isChangePassword$ = new Subject<boolean>();
  private _isErrorSendEmail$ = new Subject<boolean>();
  private _responseVerifyToken$ = new Subject<
    ResponseVerifyToken | null | number
  >();

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  getDataRegister(): Observable<number> {
    const userId = localStorage.getItem('@userId');
    const token = localStorage.getItem('@access_token')!;

    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<DataUserRegister>(BASE_URL + 'register/' + userId, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this.store.dispatch(setDataRegisterShared({ data: response }));
          this._isErrorGetRegister$.next(response.id_role);
        },
        error: (error) => {
          console.log({ error });
          this._isErrorGetRegister$.next(NaN);
          console.log(error);
        },
      });
    return this._isErrorGetRegister$.asObservable();
  }

  getChangePassword(request: RequestChangePassword): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    this.http
      .put(BASE_URL + 'change_password', request, { headers: myHeaders })
      .subscribe({
        next: (response) => {
          this.store.dispatch(setIsLoading({ value: false }));
          this._isChangePassword$.next(true);
        },
        error: (error) => {
          console.log({ error });
          this.store.dispatch(setIsLoading({ value: false }));
          this._isChangePassword$.next(false);
          this.store.dispatch(
            setIsErrorMessage({
              message: `${error.error.details}`,
            })
          );
        },
      });
    return this._isChangePassword$.asObservable();
  }

  getTrends(idRole: number) {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    if (idRole === 2) {
      const body = {
        microservice: 'get_businessmen_trends',
      };

      this.http
        .post<ResponseBuyerTrens>(
          BASE_URL + 'consume_farmer_profile_data_microservice',
          body,
          {
            headers: myHeaders,
          }
        )
        .subscribe({
          next: (response) => {
            this.store.dispatch(setDataTrends({ data: response.ranking }));
            this.store.dispatch(setIsLoading({ value: false }));
          },
          error: (error) => {
            console.log({ error });
            this.store.dispatch(setIsLoading({ value: false }));
          },
        });
    } else if (idRole === 1) {
      this.http
        .get<ResponseFarmersTrends>(
          BASE_URL + 'consume_businessman_profile_data_microservice'
        )
        .subscribe({
          next: (response) => {
            this.store.dispatch(
              setDataTrendsFarmer({ data: response.ranking })
            );
            this.store.dispatch(setIsLoading({ value: false }));
          },
          error: (error) => {
            console.log({ error });
            this.store.dispatch(setIsLoading({ value: false }));
          },
        });
    }
  }

  setSendCodeVerification(email: string): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const body = { email };
    this.http.post(BASE_URL + 'send_email_recovery_password', body).subscribe({
      next: (response: any) => {
        this._isErrorSendEmail$.next(true);
        this.store.dispatch(setIsLoading({ value: false }));
      },
      error: (error) => {
        this._isErrorSendEmail$.next(false);
        this.store.dispatch(setIsLoading({ value: false }));
      },
    });
    return this._isErrorSendEmail$.asObservable();
  }

  getVerifyToken(
    token: string
  ): Observable<ResponseVerifyToken | null | number> {
    this.http
      .get<ResponseVerifyToken>(BASE_URL + 'verify_token/' + token)
      .subscribe({
        next: (response) => {
          this._responseVerifyToken$.next(response);
        },
        error: (error) => {
          if (error.error.error === 'Invalid token') {
            this._responseVerifyToken$.next(-1);
            return;
          }
          this._responseVerifyToken$.next(null);
        },
      });
    return this._responseVerifyToken$.asObservable();
  }

  getUserRoles() {
    this.store.dispatch(setIsLoading({ value: true }));
    const userId = localStorage.getItem('@userId');
    const token = localStorage.getItem('@access_token')!;

    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<ResponseUserRoles>(BASE_URL + 'user_role/' + userId, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this.store.dispatch(setUserRoles({ data: response.userRoleExists }));
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          console.log(error);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
  }

  initEpaycoButton(sessionId: string): void {
    if (typeof ePayco === 'undefined') {
      console.error('ePayco script not loaded!');
      return;
    }

    const handler = ePayco.checkout.configure({
      sessionId,
      test: false, // Cambia a false en producción,
    });

    handler.openNew();
  }
}
