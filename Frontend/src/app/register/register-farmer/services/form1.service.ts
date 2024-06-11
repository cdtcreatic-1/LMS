import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'src/app/shared/constants';
import {
  DataRegister,
  FormRegisterFarm,
  RequestAddVillageName,
  RequestAditionalInformation,
  ResponseClimateAndTemperature,
  ResponseRegisterFarm,
} from '../interface';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { setIsLoading } from 'src/app/store/actions/loading.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';

@Injectable({
  providedIn: 'root',
})
export class Form1Service {
  private _index$ = new Subject<string>();

  private _responseResgisterFarm$ = new Subject<ResponseRegisterFarm | null>();
  private _isErrorLoadDocuments$ = new Subject<boolean>();
  private _registerFarmClimate$ =
    new Subject<ResponseClimateAndTemperature | null>();
  private _responseClimateAndTemperature$ =
    new Subject<ResponseClimateAndTemperature | null>();
  private _isErrorAditionalInformation$ = new Subject<boolean>();
  private _isErroAddVillageName$ = new Subject<boolean>();

  initialValues: DataRegister = {
    user_personal_description_text: '',
    id_type_of_information: NaN,
    User: {
      user_name: '',
      user_phone: '',
      user_email: '',
      user_username: '',
      user_cover_photo: null,
      user_profile_photo: '',
    },
    farm_name: '',
  };

  private _dataRegister$: BehaviorSubject<DataRegister> =
    new BehaviorSubject<DataRegister>(this.initialValues);

  get getIndex(): Observable<string> {
    return this._index$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private grservice: GlobalRegisterService,
    private store: Store<AppState>
  ) {}

  changeItemLetter(letter: string) {
    this._index$.next(letter);
  }

  registerFarm(
    formFarmRegister: FormRegisterFarm
  ): Observable<ResponseClimateAndTemperature | null> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const userId = localStorage.getItem('@userId');
    const request = {
      id_user: parseInt(userId!),
      farm_name: formFarmRegister.nameFarm,
      farm_number_lots: formFarmRegister.numberLots,
      id_village: parseInt(formFarmRegister.village),
      farm_longitude: formFarmRegister.farmLongitude,
      farm_latitude: formFarmRegister.farmLatitude,
      name_provided_by_user: formFarmRegister.newNameVillage,
    };

    this.http
      .post(BASE_URL + 'register_farm', request, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this.getClimateAndTemperature({
            lon: response.farmSaved.farm_longitude,
            lat: response.farmSaved.farm_latitude,
            idFarm: response.farmSaved.id_farm,
          }).subscribe((resClimate) => {
            if (!resClimate) this._registerFarmClimate$.next(null);
            this._registerFarmClimate$.next(resClimate);
            this.store.dispatch(setIsLoading({ value: false }));
          });
        },
        error: () => {
          this._registerFarmClimate$.next(null);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });

    return this._registerFarmClimate$.asObservable();
  }

  registerFarmDashboard(
    formFarmRegister: FormRegisterFarm
  ): Observable<ResponseRegisterFarm | null> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const userId = localStorage.getItem('@userId');
    const request = {
      id_user: parseInt(userId!),
      farm_name: formFarmRegister.nameFarm,
      farm_number_lots: formFarmRegister.numberLots,
      id_village: parseInt(formFarmRegister.village),
      farm_longitude: formFarmRegister.farmLongitude,
      farm_latitude: formFarmRegister.farmLatitude,
    };

    this.http
      .post(BASE_URL + 'register_farm', request, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this._responseResgisterFarm$.next(response);
        },
        error: () => {
          this._responseResgisterFarm$.next(null);
        },
      });
    return this._responseResgisterFarm$.asObservable();
  }

  getClimateAndTemperature(body: {
    lon: number;
    lat: number;
    idFarm: number;
  }): Observable<ResponseClimateAndTemperature | null> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const request = {
      latitude: body.lat,
      longitude: body.lon,
    };

    this.http
      .post(BASE_URL + 'get_climate_and_temperature', request, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          const bodyAditional: RequestAditionalInformation = {
            id_farm: body.idFarm,
            altitude: response.data.altitude,
            climate: response.data.climate,
            temperature: response.data.temperature,
          };
          this.getAditionalInformation(bodyAditional);

          this._responseClimateAndTemperature$.next(response);
        },
        error: () => {
          this._responseClimateAndTemperature$.next(null);
        },
      });
    return this._responseClimateAndTemperature$.asObservable();
  }

  getAditionalInformation(
    body: RequestAditionalInformation
  ): Observable<boolean> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post(BASE_URL + 'farms_additional_info', body, { headers: myHeaders })
      .subscribe({
        next: (response) => {
          this._isErrorAditionalInformation$.next(true);
        },
        error: () => {
          this._isErrorAditionalInformation$.next(false);
        },
      });
    return this._isErrorAditionalInformation$.asObservable();
  }

  LoadDocumentsFarm(documentation: FormData): Observable<boolean> {
    const userId = localStorage.getItem('@userId');
    documentation.append('id_user', userId!);
    this.http.post(BASE_URL + 'user_documents', documentation).subscribe({
      next: (response: any) => {
        const bodyCurrentWindowData = {
          id_user: parseInt(userId!),
          current_window_id: 14,
          current_farm_number_lot: 1,
        };
        this.grservice.setCurrentWindowPUT(bodyCurrentWindowData);
        this._isErrorLoadDocuments$.next(false);
      },
      error: (error) => {
        this._isErrorLoadDocuments$.next(true);
      },
    });
    return this._isErrorLoadDocuments$.asObservable();
  }

  dataUserFarmer(): Observable<DataRegister> {
    return this._dataRegister$.asObservable();
  }

  setAddVillageName(body: RequestAddVillageName): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post(BASE_URL + 'villages', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          this.store.dispatch(setIsLoading({ value: false }));
          this._isErroAddVillageName$.next(true);
        },
        error: (error) => {
          this._isErroAddVillageName$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({ message: `${error.message}` })
          );
        },
      });
    return this._isErroAddVillageName$.asObservable();
  }
}
