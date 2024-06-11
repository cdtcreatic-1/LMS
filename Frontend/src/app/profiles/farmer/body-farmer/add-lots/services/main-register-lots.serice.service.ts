import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { BASE_URL } from 'src/app/shared/constants';
import { DataProfileCoffe } from '../type-cofee/interfaces';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  setActualIdRegisterLot,
  setChangeActualIdDasboard,
  setDataNameCoffee,
} from 'src/app/store/actions/user-menu.actions';
import {
  FormPriceCoffee,
  FormReviewCoffee,
  FormTypeCoffee,
} from '../interfaces';
import { setIsLoading } from 'src/app/store/actions/loading.actions';
import { clearStateAddLots } from 'src/app/store/actions/add-lots.actions';

@Injectable({
  providedIn: 'root',
})
export class MainRegisterLotsService implements OnDestroy {
  private _isErrorRegisterLots$ = new Subject<number>();
  private _dataProfilesCoffee$ = new Subject<DataProfileCoffe>();

  suscription = new Subscription();

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  getDataProfilesCoffee(): Observable<DataProfileCoffe> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.suscription = this.http
      .get(BASE_URL + 'coffee_info_data', { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this._dataProfilesCoffee$.next(response);
          this.store.dispatch(setDataNameCoffee({ dataNameCoffee: response }));
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          console.log(error);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });

    return this._dataProfilesCoffee$.asObservable();
  }

  RegisterLots(body: FormTypeCoffee): Observable<number> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    this.suscription = this.http
      .post(BASE_URL + 'register_lots', body, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this._isErrorRegisterLots$.next(response.lot_id.id_lot);
        },
        error: (error) => {
          this._isErrorRegisterLots$.next(NaN);
        },
      });
    return this._isErrorRegisterLots$.asObservable();
  }

  getRegisterPriceLots(body: FormPriceCoffee): Promise<any> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const promise = new Promise<any>((resolve, reject) => {
      this.http
        .post(BASE_URL + 'lot_quantity', body, { headers: myHeaders })
        .subscribe((response) => {
          console.log({ response });
          resolve(response);
        });
    });
    return promise;
  }

  getRegiterLotsReview(body: FormReviewCoffee): Promise<any> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const promise = new Promise<any>((resolve, reject) => {
      this.http
        .post(BASE_URL + 'lot_summary', body, { headers: myHeaders })
        .subscribe((response) => {
          console.log({ response });
          resolve(response);
        });
    });
    return promise;
  }

  getResgisterLotsQGraderCertification(body: FormData): Promise<any> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const promise = new Promise<any>((resolve, reject) => {
      this.http
        .post(BASE_URL + 'lot_certifications', body, { headers: myHeaders })
        .subscribe((response) => {
          this.store.dispatch(setIsLoading({ value: false }));
          console.log({ response });
          resolve(response);
        });
    });
    return promise;
  }

  getRegisterPhotoLot(body: FormData): Promise<any> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const promise = new Promise<any>((resolve, reject) => {
      this.http
        .post(BASE_URL + 'lot_photo', body, { headers: myHeaders })
        .subscribe((response) => {
          console.log({ response });
          resolve(response);
        });
    });
    return promise;
  }

  async promiseAll(
    bodyPrice: FormPriceCoffee,
    bodyReview: FormReviewCoffee,
    bodyCertification: FormData | null,
    bodyPhoto: FormData
  ): Promise<any> {
    try {
      if (bodyCertification) {
        return await Promise.all([
          this.getRegisterPriceLots(bodyPrice),
          this.getRegiterLotsReview(bodyReview),
          this.getResgisterLotsQGraderCertification(bodyCertification),
          this.getRegisterPhotoLot(bodyPhoto),
        ]);
      } else {
        return await Promise.all([
          this.getRegisterPriceLots(bodyPrice),
          this.getRegiterLotsReview(bodyReview),
          this.getRegisterPhotoLot(bodyPhoto),
        ]);
      }
    } catch (error) {
      console.log({ error });
    }
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
