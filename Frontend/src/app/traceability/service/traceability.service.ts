import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/app/shared/constants';
import { DataTraceability } from '../interfaces';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TraceabilityService {
  private _dataTraceability$ = new Subject<DataTraceability | null>();

  constructor(private http: HttpClient) {}

  getDataFarmer(idPurchase: string): Observable<DataTraceability | null> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<DataTraceability>(BASE_URL + 'get_tracking/' + `${idPurchase}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._dataTraceability$.next(response);
        },
        error: (error) => {
          this._dataTraceability$.next(null);
        },
      });
    return this._dataTraceability$.asObservable();
  }
}
