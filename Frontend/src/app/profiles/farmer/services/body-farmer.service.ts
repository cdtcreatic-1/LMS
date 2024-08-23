import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { BASE_URL } from 'src/app/shared/constants';
import {
  setDataFarm,
  setDataLotsByFarm,
  setDataPriceRecomendation,
  setDataTableStateSell,
  setDocumentsFarmer,
  setNotificationFarmer,
  setOffertLost,
} from 'src/app/store/actions/user-menu.actions';
import { AppState } from 'src/app/store/app.state';
import { selectDataCurrentWindow } from 'src/app/store/selectors/global.selector';
import { setDataTableBusinessman } from 'src/app/store/actions/user-menu-businessman.actions';
import {
  DataProfileFarm,
  ResponseDataFarms,
  ResponseDocumentFarmer,
  ResponseTotalLots,
} from 'src/app/profiles/farmer/interfaces';
import { setIsLoading } from 'src/app/store/actions/loading.actions';
import { GlobalRegisterService } from 'src/app/register/services/register.service';

@Injectable({
  providedIn: 'root',
})
export class BodyFarmerService {
  private _bodyFarmer$ = new Subject<string>();
  private _modalNotification$ = new Subject<boolean>();
  private _isErrorTotalLots$ = new Subject<boolean>();
  private _isErrorRecomendationPrice$ = new Subject<boolean>();
  private _isErrorDocumentsFarmer$ = new Subject<boolean>();
  private _isErrorLoadDocumentsFarmer$ = new Subject<boolean>();
  private _isErrorNotificationFarmer$ = new Subject<boolean>();
  private _isErrorTableStateSellFarmer$ = new Subject<boolean>();
  private _isErrorPutNotification$ = new Subject<boolean>();
  private _idFarm: number = NaN;
  private _documents: ResponseDocumentFarmer;
  private _rol$ = new Subject<number>();

  get getRol(): Observable<number> {
    return this._rol$.asObservable();
  }

  get getBodyFarmer() {
    return this._bodyFarmer$.asObservable();
  }

  get getModalNotification() {
    return this._modalNotification$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private grservice: GlobalRegisterService
  ) {
    this.store.select(selectDataCurrentWindow).subscribe((data) => {
      this._idFarm = data.dataCurrentWindow?.id_farm!;
    });
  }

  setRol(id: number) {
    this._rol$.next(id);
  }

  setBodyFarmer(value: string) {
    this._bodyFarmer$.next(value);
  }

  setModalNotification(value: boolean) {
    this._modalNotification$.next(value);
  }

  getAllLotsByFarm(idFarm: number): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get(`${BASE_URL}get_lot_info/${idFarm}`, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this.store.dispatch(setDataLotsByFarm({ allLots: response.data }));
          this._isErrorTotalLots$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorTotalLots$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });

    return this._isErrorTotalLots$.asObservable();
  }

  getRegisterPriceRecomendation(body: {
    variety_name: string;
  }): Observable<boolean> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    this.http
      .post(BASE_URL + 'get_coffee_recommended_prices', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: async (response: any) => {
          this.store.dispatch(
            setDataPriceRecomendation({ dataPrice: response })
          );
          this._isErrorRecomendationPrice$.next(true);
        },
        error: (error) => {
          this._isErrorRecomendationPrice$.next(false);
        },
      });
    return this._isErrorRecomendationPrice$.asObservable();
  }

  setDocumentsFarmer(
    documentation: FormData,
    idFarm: number
  ): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const userId = localStorage.getItem('@userId');
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    documentation.append('id_user', `${userId}`);
    this.http
      .post(BASE_URL + 'farm_documentation', documentation, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          this._isErrorDocumentsFarmer$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorDocumentsFarmer$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });

    return this._isErrorDocumentsFarmer$.asObservable();
  }

  getDocumentsFarmer(): Observable<boolean> {
    const userId = localStorage.getItem('@userId');
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get(BASE_URL + 'farm_documentation/' + `${userId}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: async (response: any) => {
          this._documents = response;

          this.store.dispatch(setDocumentsFarmer({ data: this._documents }));
        },
        error: (error) => {
          console.log({ error });
        },
      });
    return this._isErrorLoadDocumentsFarmer$.asObservable();
  }

  getNotification(): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const userId: string = localStorage.getItem('@userId')!;
    this.http
      .get(BASE_URL + 'get_notifications_for_farmer/' + `${userId}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: async (response: any) => {
          this.store.dispatch(
            setNotificationFarmer({ data: response.purchaseData })
          );
          this._isErrorNotificationFarmer$.next(true);
        },
        error: (error) => {
          this._isErrorNotificationFarmer$.next(false);
        },
      });
    this.store.dispatch(setIsLoading({ value: false }));
    return this._isErrorNotificationFarmer$.asObservable();
  }

  getTableStateSell(idRole: number): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const userId: string = localStorage.getItem('@userId')!;
    this.http
      .get(BASE_URL + 'get_purchase_status_table/' + `${userId}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: async (response: any) => {
          if (idRole === 1) {
            this.store.dispatch(
              setDataTableStateSell({ data: response.purchaseData })
            );
          } else if (idRole === 2) {
            this.store.dispatch(
              setDataTableBusinessman({ data: response.purchaseData })
            );
          }
          this._isErrorTableStateSellFarmer$.next(true);
        },
        error: (error) => {
          this._isErrorTableStateSellFarmer$.next(false);
        },
      });
    this.store.dispatch(setIsLoading({ value: false }));
    return this._isErrorTableStateSellFarmer$.asObservable();
  }

  getOffertLot(idBuyer: number): Observable<boolean> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const userId: string = localStorage.getItem('@userId')!;

    const body = {
      id_seller: parseInt(userId),
      id_buyer: idBuyer,
    };

    this.http
      .post(BASE_URL + 'get_sorted_lots_based_on_buyer_preferences', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: async (response: any) => {
          this.store.dispatch(setOffertLost({ data: response, idBuyer }));
          this._isErrorRecomendationPrice$.next(true);
        },
        error: (error) => {
          this._isErrorRecomendationPrice$.next(false);
        },
      });
    return this._isErrorRecomendationPrice$.asObservable();
  }

  setNotificatonOfertLot(
    idBuyer: number,
    idLot: number,
    idStatusOffert: number
  ): Observable<boolean> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const userId: string = localStorage.getItem('@userId')!;

    const body = {
      id_seller: parseInt(userId),
      id_lot: idLot,
      id_buyer: idBuyer,
      id_offer_status: idStatusOffert,
    };

    this.http
      .post(BASE_URL + 'notification_for_businessman', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._isErrorPutNotification$.next(true);
        },
        error: (error) => {
          this._isErrorPutNotification$.next(false);
          console.log(error);
        },
      });
    return this._isErrorPutNotification$.asObservable();
  }

  getDataProfileFarm() {
    const userId: string = localStorage.getItem('@userId')!;
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'get_farms_from_user',
      id_user: parseInt(userId),
    };

    this.http
      .post<ResponseDataFarms>(
        BASE_URL + 'consume_farmer_profile_data_microservice',
        body,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this.store.dispatch(setDataFarm({ data: response.farms_info }));
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  deleteFarms(dataFarms: DataProfileFarm[]) {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    dataFarms.forEach((farm) => {
      this.store.dispatch(setIsLoading({ value: true }));
      this.http
        .delete(BASE_URL + 'delete_farms_by_id_farm/' + farm.id_farm, {
          headers: myHeaders,
        })
        .subscribe({
          next: (response: any) => {
            this.getDataProfileFarm();
            this.grservice.getDataRegisterFarm();
            this.store.dispatch(setIsLoading({ value: false }));
          },
          error: (error) => {
            console.log(error);
            this.store.dispatch(setIsLoading({ value: false }));
          },
        });
    });
  }

  deleteLots(dataLots: ResponseTotalLots[], idFarm: number) {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    dataLots.forEach((lot) => {
      this.store.dispatch(setIsLoading({ value: true }));
      this.http
        .delete(BASE_URL + 'delete_lot_by_id_lot/' + lot.id_lot, {
          headers: myHeaders,
        })
        .subscribe({
          next: (response: any) => {
            this.getAllLotsByFarm(idFarm);
            this.store.dispatch(setIsLoading({ value: false }));
          },
          error: (error) => {
            console.log(error);
            this.store.dispatch(setIsLoading({ value: false }));
          },
        });
    });
  }
}
