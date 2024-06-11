import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RequestRecoverPassword } from '../interfaces';
import { BASE_URL } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class SharedProfilesService {
  private _responseChangePassword$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  setChangePassword(
    formRecoverPassword: RequestRecoverPassword,
    token: string
  ): Observable<boolean> {
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      new_password: formRecoverPassword.newPassword,
      confirm_password: formRecoverPassword.repeatNewPassword,
    };

    this.http
      .put(BASE_URL + 'auth_change_password', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          this._responseChangePassword$.next(true);
        },
        error: (error) => {
          this._responseChangePassword$.next(false);
        },
      });
    return this._responseChangePassword$.asObservable();
  }
}
