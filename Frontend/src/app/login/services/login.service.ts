import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BASE_URL } from 'src/app/shared/constants';
import { LoginRequest, initialStateLogin } from '../interfaces';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { setIsLoading } from 'src/app/store/actions/loading.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _initialStateLogin$ = new Subject<initialStateLogin>();

  constructor(
    private http: HttpClient,
    private grservice: GlobalRegisterService,
    private store: Store<AppState>
  ) {}

  setLogin(formLogin: LoginRequest): Observable<initialStateLogin> {
    this.store.dispatch(setIsLoading({ value: true }));
    this.http
      .post(BASE_URL + 'login', {
        user_email: formLogin.email,
        user_password: formLogin.password,
      })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('@access_token', response.user_token);
          localStorage.setItem('@userId', response.id_user);
          this.grservice
            .getCurrentWindow(response.id_user)
            .subscribe((data) => {
              this._initialStateLogin$.next({
                rolId: response.id_role,
                userId: response.id_user,
                isErrorLogin: false,
                code: 'Hola',
                currentWindow: data.current_window_id,
              });
            });
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          console.log(error.error.code);
          this._initialStateLogin$.next({
            rolId: undefined,
            userId: undefined,
            isErrorLogin: true,
            code:
              error.error.code === 'not_found'
                ? 'Usuario no existe'
                : 'Usuario o contraseña incorrectos',
            currentWindow: 0,
          });
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });

    return this._initialStateLogin$.asObservable();
  }
}
