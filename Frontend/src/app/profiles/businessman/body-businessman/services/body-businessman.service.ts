import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, Subscription } from 'rxjs';
import { BASE_URL } from 'src/app/shared/constants';
import {
  setDataCarShop,
  setDataFarmerSelected,
  setDataFarmers,
  setDataLotsBusinessman,
  setDataSearchProducts,
  setDocumentBusinessman,
  setNotificationBusinessman,
  setResponseSearchProducts,
} from 'src/app/store/actions/user-menu-businessman.actions';
import { AppState } from 'src/app/store/app.state';
import {
  DataFarmerSelected,
  DataLots,
  DataRequestCarShop,
  Farmers,
  RequestPurchase,
  ResponseNotificationBusinessman,
  ResponsePurchase,
} from '../interfaces';
import {
  selectBusinessProfile,
  selectDataShared,
} from 'src/app/store/selectors/global.selector';
import { setIsLoading } from 'src/app/store/actions/loading.actions';
import {
  RequestDataSearchProduts,
  ResponseDataSearchProducts,
  ResponseItemDataSearch,
} from '../../interfaces';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';

@Injectable({
  providedIn: 'root',
})
export class BodyBusinessmanService implements OnDestroy {
  private _bodyBusinessman$ = new Subject<string>();
  private _modalNotification$ = new Subject<boolean>();
  private _isErrorAddCarShop$ = new Subject<boolean>();
  private _isErrorPurchaser$ = new Subject<ResponsePurchase | null>();
  private _isErrorDeleteCartShop$ = new Subject<boolean>();
  private _isErrorPutPurchase$ = new Subject<boolean>();
  private _isErrorPutNotification$ = new Subject<boolean>();
  private _isErrorRefEpayco$ = new Subject<boolean>();
  private _isErrorSearchProducts$ = new Subject<boolean>();
  private _offert$ = new Subject<number>();
  private _userId: number = NaN;

  suscription = new Subscription();

  get getBodyBusinessman(): Observable<string> {
    return this._bodyBusinessman$.asObservable();
  }

  get getModalNotification(): Observable<boolean> {
    return this._modalNotification$.asObservable();
  }

  get getRol(): Observable<number> {
    return this._offert$.asObservable();
  }

  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.store.select(selectDataShared).subscribe((data) => {
      this._userId = data.dataUserRegister?.id_user!;
    });
  }

  setBodyBusinessman(value: string) {
    this._bodyBusinessman$.next(value);
  }

  setModalNotification(value: boolean) {
    this._modalNotification$.next(value);
  }

  setTypeOffertNotificatrion(id: number) {
    this._offert$.next(id);
  }

  getFarmers() {
    const token = localStorage.getItem('@access_token')!;
    const idUser = localStorage.getItem('@userId')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<Farmers[]>(BASE_URL + 'get_farmers/' + `${idUser}`, {
        headers: myHeaders,
      })
      .subscribe((data) => {
        this.store.dispatch(setDataFarmers({ data }));
      });
  }

  getLotsFarmerInBusinessman(idFarmer: number) {
    this.store.dispatch(setIsLoading({ value: true }));
    this.store.dispatch(setDataLotsBusinessman({ data: [] }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let dataLots: DataLots[] = [];
    this.http
      .get(BASE_URL + 'get_lots_by_user/' + `${idFarmer}`, {
        headers: myHeaders,
      })
      .subscribe((data: any) => {
        if (data.data.length === 0) return;
        data.data.forEach(async (lot: DataLots) => {
          dataLots.push({
            ...lot,
          });
        });
      });

    setTimeout(() => {
      this.store.dispatch(setDataLotsBusinessman({ data: dataLots }));
      this.store.dispatch(setIsLoading({ value: false }));
    }, 1000);
  }

  getDataFarmer(idFamer: number) {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get(BASE_URL + 'farmer_profile/' + `${idFamer}`, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          let user: DataFarmerSelected = {
            user_name: response.User.user_name,
            farm_name: response.farm_name,
            path_photo: response.User.user_profile_photo,
            description_text: response.user_personal_description_text,
            id_farmer: idFamer,
          };
          this.store.dispatch(setDataFarmerSelected({ data: user }));
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getDocumentsBusinesman(userId?: number) {
    this.http.get(BASE_URL + 'business_data/' + userId).subscribe({
      next: (response: any) => {
        this.store.dispatch(setDocumentBusinessman({ path: response.url }));
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getNotificationBusinessman() {
    const userId = localStorage.getItem('@userId');
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<ResponseNotificationBusinessman>(
        BASE_URL + 'notification_for_businessman/' + `${userId}`,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this.store.dispatch(
            setNotificationBusinessman({ data: response.processedOffers })
          );
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  setNotificationBusinessmanPUT(
    idSeller: number,
    idLot: number,
    idStatusOffert: number
  ): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      id_seller: idSeller,
      id_lot: idLot,
      id_buyer: this._userId,
      id_offer_status: idStatusOffert,
    };

    this.http
      .put(BASE_URL + 'notification_for_businessman', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this._isErrorPutNotification$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorPutNotification$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          console.log(error);
        },
      });
    return this._isErrorPutNotification$.asObservable();
  }

  setCarShop(idFarmer: number, idlot: number): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      id_seller: idFarmer,
      id_buyer: this._userId,
      id_lot: idlot,
    };

    this.http.post(BASE_URL + 'cart', body, { headers: myHeaders }).subscribe({
      next: (response: any) => {
        this._isErrorAddCarShop$.next(true);
        this.store.dispatch(setIsLoading({ value: false }));
      },
      error: (error) => {
        this._isErrorAddCarShop$.next(false);
        this.store.dispatch(setIsLoading({ value: false }));
        this.store.dispatch(
          setIsErrorMessage({
            message: `${error.error.message}`,
          })
        );
      },
    });
    return this._isErrorAddCarShop$.asObservable();
  }

  getCarShop() {
    const userId = localStorage.getItem('@userId');
    const token = localStorage.getItem('@access_token')!;

    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get(BASE_URL + 'cart/' + `${userId}`, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this.store.dispatch(setDataCarShop({ data: response.cartData }));
        },
        error: (error) => {
          console.log({ error });
        },
      });
  }

  deleteCarShop(idLot: number): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http
      .delete(BASE_URL + 'cart/' + `${this._userId}/${idLot}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          this._isErrorDeleteCartShop$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorDeleteCartShop$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          console.log({ error });
        },
      });
    return this._isErrorDeleteCartShop$.asObservable();
  }

  setPurchase(purchase: RequestPurchase): Observable<ResponsePurchase | null> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const newDataCart: DataRequestCarShop[] = [];

    this.store.select(selectBusinessProfile).subscribe((data) => {
      data.dataCarShop.forEach((lot) => {
        newDataCart.push({
          id_cart: lot.id_cart,
          is_sample: false,
          purchase_quantity: lot.quantity,
        });
      });

      const body = {
        id_shipping_option: purchase.id_shipping_option,
        shipping_address: purchase.shipping_address,
        additional_notes: purchase.additional_notes,
        data: newDataCart,
      };

      this.http
        .post<ResponsePurchase>(BASE_URL + 'purchase', body, {
          headers: myHeaders,
        })
        .subscribe({
          next: (response) => {
            this.store.dispatch(setIsLoading({ value: false }));
            this._isErrorPurchaser$.next(response);
          },
          error: (error) => {
            this.store.dispatch(setIsLoading({ value: false }));
            this._isErrorPurchaser$.next(null);
            this.store.dispatch(
              setIsErrorMessage({
                message: `${error.error.details}`,
              })
            );
          },
        });
    });

    return this._isErrorPurchaser$.asObservable();
  }

  setChangeStatusPurchase(
    idPurchase: number,
    idPurchaseStatus: number
  ): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      id_purchase: idPurchase,
      id_purchase_status: idPurchaseStatus,
    };
    this.http
      .put(BASE_URL + 'change_purchase_status', body, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this._isErrorPutPurchase$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorPutPurchase$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });

    return this._isErrorPutPurchase$.asObservable();
  }

  setParseReference(reference: string): Observable<boolean> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      reference,
    };
    this.http
      .post(BASE_URL + 'parse_ref', body, { headers: myHeaders })
      .subscribe({
        next: () => {
          return this._isErrorRefEpayco$.next(true);
        },
        error: () => {
          return this._isErrorRefEpayco$.next(false);
        },
      });

    return this._isErrorRefEpayco$.asObservable();
  }

  getItemsSearhProduct(): Observable<boolean> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'get_available_items_for_lots',
    };

    this.http
      .post<ResponseItemDataSearch>(
        BASE_URL + 'consume_businessman_profile_data_microservice',
        body,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this.store.dispatch(setDataSearchProducts({ data: response.data }));
        },
        error: (error) => {
          console.log({ error });
        },
      });

    return this._isErrorRefEpayco$.asObservable();
  }

  setSearchProduct(req: RequestDataSearchProduts): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'get_products_by_filtered_search',
      lot_properties: {
        id_variety: req.lot_properties.id_variety,
        id_profile: req.lot_properties.id_profile,
        id_roast: req.lot_properties.id_roast,
      },
      price_range: {
        min_price: req.price_range.min_price,
        max_price: req.price_range.max_price,
      },
      id_state: req.id_state,
    };

    this.http
      .post<ResponseDataSearchProducts>(
        BASE_URL + 'consume_businessman_profile_data_microservice',
        body,
        {
          headers: myHeaders,
        }
      )
      .subscribe({
        next: (response) => {
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(setResponseSearchProducts({ data: response }));
          this._isErrorSearchProducts$.next(true);
        },
        error: (error) => {
          this._isErrorSearchProducts$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          console.log({ error });
        },
      });

    return this._isErrorSearchProducts$.asObservable();
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
