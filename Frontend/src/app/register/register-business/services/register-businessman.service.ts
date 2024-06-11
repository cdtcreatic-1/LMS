import { Injectable } from '@angular/core';
import { FormRegiserBusinessman, RegisterInterested } from '../model';
import { BASE_URL } from 'src/app/shared/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setDataRegisterBusinessman } from 'src/app/store/actions/user-menu.actions';
import { ResponseRegisterBusineeman } from '../../register-farmer/interface';
import { setIsLoading } from 'src/app/store/actions/loading.actions';

@Injectable({
  providedIn: 'root',
})
export class RegisterBusinessmanService {
  private _isErrorRegister$ = new Subject<boolean>();

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  setRegiterBusinessman(form: FormRegiserBusinessman): Observable<boolean> {
    this.http.post(BASE_URL + 'register', form).subscribe({
      next: (response: any) => {
        this._isErrorRegister$.next(false);
      },
      error: (error) => {
        this._isErrorRegister$.next(true);
      },
    });
    return this._isErrorRegister$.asObservable();
  }

  setRegisterInterested(form: RegisterInterested): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const userId = localStorage.getItem('@userId');
    const body = { ...form, id_user: userId };
    this.http
      .post(BASE_URL + 'businesman_coffee_interested', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          this._isErrorRegister$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorRegister$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
    return this._isErrorRegister$.asObservable();
  }

  getInterestBusinessman() {
    const userId = localStorage.getItem('@userId');

    this.http
      .get(BASE_URL + 'businesman_coffee_interested/' + userId)
      .subscribe({
        next: (response: any) => {
          let user: ResponseRegisterBusineeman = {
            ...response,
            user_profile_photo: response.user_profile_photo,
          };

          // this.store.dispatch(setDataRegisterBusinessman({ data: user }));
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getDataRegisterBusinessman() {
    const userId = localStorage.getItem('@userId');

    this.http.get(BASE_URL + 'register/' + userId).subscribe({
      next: (response: any) => {
        let user: ResponseRegisterBusineeman = {
          ...response,
          user_profile_photo: response.user_profile_photo,
        };

        this.store.dispatch(setDataRegisterBusinessman({ data: user }));
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
