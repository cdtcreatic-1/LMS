import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/app/shared/constants';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalRegisterService } from 'src/app/register/services/register.service';

@Injectable({
  providedIn: 'root',
})
export class Form2BusinessService {
  private _isErrorLoadNameDocumentBusiness$ = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private grservice: GlobalRegisterService
  ) {}

  LoadNameDocumentBusiness(documentation: FormData): Observable<boolean> {
    const userId = localStorage.getItem('@userId');
    documentation.append('id_user', userId!);
    this.http.post(BASE_URL + 'business_data', documentation).subscribe({
      next: (response: any) => {
        const bodyCurrentWindowData = {
          id_user: parseInt(userId!),
          current_window_id: 3,
          current_farm_number_lot: 1,
        };
        this.grservice.setCurrentWindowPUT(bodyCurrentWindowData);
        this._isErrorLoadNameDocumentBusiness$.next(false);
      },
      error: (error) => {
        this._isErrorLoadNameDocumentBusiness$.next(true);
      },
    });
    return this._isErrorLoadNameDocumentBusiness$.asObservable();
  }
}
