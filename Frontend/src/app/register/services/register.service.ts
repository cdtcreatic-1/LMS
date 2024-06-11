import {
  HttpClient,
  HttpContextToken,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL, OPTIONS } from 'src/app/shared/constants';
import { Observable, Subject } from 'rxjs';
import {
  BodyCurrentWindowData,
  Cities,
  Countries,
  ReponseDataCoordinates,
  ReponseRegister,
  RequeestCoordinates,
  RequestLonLat,
  ResponseIdsByCoordinates,
  ResponseStates,
  Villages,
} from '../register-farmer/interface';
import { DataCurrentWindow } from '../interfaces';

import { Store } from '@ngrx/store';
import { setDataRegister } from 'src/app/store/actions/user-menu.actions';
import {
  changeCurrentWindow,
  setDataCurrentWindow,
} from 'src/app/store/actions/current-window.actions';
import { SharedService } from 'src/app/shared/services/shared.service';
import { setIsLoading } from 'src/app/store/actions/loading.actions';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';

@Injectable({
  providedIn: 'root',
})
export class GlobalRegisterService {
  private _isErrorRegister$ = new Subject<boolean>();
  private _isErrorEditRegister$ = new Subject<boolean>();
  private _isErrorAddRole$ = new Subject<boolean>();
  private _isErrorCoverPortada$ = new Subject<boolean>();
  private _isErrorLoadText$ = new Subject<boolean>();
  private _countries$ = new Subject<Countries[]>();
  private _states$ = new Subject<ResponseStates>();
  private _cities$ = new Subject<Cities[]>();
  private _villages$ = new Subject<Villages[]>();
  private _current_window$ = new Subject<number>();
  private _dataCurrentWindows$ = new Subject<DataCurrentWindow>();
  public dataCurrentWindow: DataCurrentWindow & { id_user: number };
  private _isErrorLoadAudioText$ = new Subject<boolean>();
  private _dataCoordinates$ = new Subject<ReponseDataCoordinates>();
  private _dataIdsByCoordinates$ = new Subject<ResponseIdsByCoordinates>();

  userId: string | null = null;

  get getCurrentWindowItem(): Observable<number> {
    return this._current_window$.asObservable();
  }

  get getDataCurrentWindowObs(): Observable<DataCurrentWindow> {
    return this._dataCurrentWindows$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private store: Store,
    private sharedService: SharedService
  ) {
    this.userId = localStorage.getItem('@userId');
  }

  setRegiter(
    formRegister: FormData,
    currentWindowId?: number
  ): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    this.http
      .post<ReponseRegister>(BASE_URL + 'register', formRegister)
      .subscribe({
        next: (response) => {
          this._isErrorRegister$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorRegister$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
          this.store.dispatch(
            setIsErrorMessage({
              message: `${JSON.stringify(error.error.message)}`,
            })
          );
        },
      });

    return this._isErrorRegister$.asObservable();
  }

  setRegiterApprentice(formRegister: FormData): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    this.http.post(BASE_URL + 'register', formRegister).subscribe({
      next: (response) => {
        this._isErrorRegister$.next(true);
        this.store.dispatch(setIsLoading({ value: false }));
      },
      error: (error) => {
        this._isErrorRegister$.next(false);
        this.store.dispatch(setIsLoading({ value: false }));
        this.store.dispatch(
          setIsErrorMessage({
            message: `${error.error.code}`,
          })
        );
      },
    });
    return this._isErrorRegister$.asObservable();
  }

  setRegiterPUT(formRegister: FormData): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .put(BASE_URL + 'register', formRegister, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this._isErrorEditRegister$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorEditRegister$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });

    return this._isErrorEditRegister$.asObservable();
  }

  setAddRole(idUser: number, idRole: number): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      id_user: idUser,
      id_role: idRole,
    };

    this.http
      .post(BASE_URL + 'user_role', body, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this._isErrorAddRole$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorAddRole$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });

    return this._isErrorAddRole$.asObservable();
  }

  getDataRegisterFarm(idFamer?: number) {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const userId = localStorage.getItem('@userId');
    this.http
      .get(BASE_URL + 'farmer_profile/' + `${idFamer ? idFamer : userId}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response: any) => {
          let user = {
            ...response.User,
            user_profile_photo: response.User.user_profile_photo,
          };
          this.store.dispatch(setDataRegister({ ...response, User: user }));
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getCountries(): Observable<Countries[]> {
    this.http.get(BASE_URL + 'get_countries').subscribe({
      next: (response: any) => {
        this._countries$.next(response);
      },
      error: (error) => {
        this._countries$.next([]);
      },
    });
    return this._countries$.asObservable();
  }

  getStates(idCountry: string): Observable<ResponseStates> {
    this.http
      .get<ResponseStates>(BASE_URL + 'get_states/' + idCountry)
      .subscribe({
        next: (response) => {
          const stateRef = [...response.states];
          const newDataStates = stateRef.filter(
            (item) => item.id_state !== 784
          );

          this._states$.next({
            message: response.message,
            states: [...newDataStates],
          });
        },
        error: (error) => {
          this._states$.next({ message: '', states: [] });
        },
      });
    return this._states$.asObservable();
  }

  getCities(idState: string): Observable<Cities[]> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get(BASE_URL + 'get_cities/' + idState, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this._cities$.next(response);
        },
        error: (error) => {
          this._cities$.next([]);
        },
      });
    return this._cities$.asObservable();
  }

  getVillage(idCity: string): Observable<Villages[]> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<Villages[]>(BASE_URL + 'get_villages/' + idCity, {
        headers: myHeaders,
      })
      .subscribe({
        next: (response) => {
          let nombreDesconocido: boolean = true;
          let newVillage = response.filter((item) => {
            if (!nombreDesconocido) return null;
            if (item.village_name === 'NOMBRE DESCONOCIDO') {
              nombreDesconocido = false;
            }

            return { ...item };
          });

          this._villages$.next(newVillage);
        },
        error: (error) => {
          this._villages$.next([]);
        },
      });
    return this._villages$.asObservable();
  }

  getCoordinatesByVillage(
    idCoordinates: RequeestCoordinates
  ): Observable<ReponseDataCoordinates> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'get_geoinformation_from_polygon',
      id_state: idCoordinates.id_state,
      id_city: idCoordinates.id_city,
      id_village: idCoordinates.id_village,
    };

    this.http
      .post(BASE_URL + 'consume_farmer_profile_data_microservice', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (res: any) => {
          this._dataCoordinates$.next(res);
        },
        error: (error) => {
          console.log(error);
        },
      });
    return this._dataCoordinates$.asObservable();
  }

  getIdsByCoordinates(
    coordinates: RequestLonLat
  ): Observable<ResponseIdsByCoordinates> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      microservice: 'get_entities_ids_from_coordinate',
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
    };

    this.http
      .post(BASE_URL + 'consume_farmer_profile_data_microservice', body, {
        headers: myHeaders,
      })
      .subscribe({
        next: (res: any) => {
          this._dataIdsByCoordinates$.next(res);
        },
        error: (error) => console.log(error),
      });
    return this._dataIdsByCoordinates$.asObservable();
  }

  getCurrentWindow(userId: string): Observable<DataCurrentWindow> {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get(BASE_URL + 'current_window_data' + `/${userId}`, {
        headers: myHeaders,
      })
      .subscribe({
        next: (res: any) => {
          this._current_window$.next(res.current_window_id);
          this._dataCurrentWindows$.next(res);
          this.store.dispatch(setDataCurrentWindow(res));
          this.dataCurrentWindow = { ...res, id_user: parseInt(userId) };
          return this;
        },
        error: (error) => console.log(error),
      });
    return this._dataCurrentWindows$.asObservable();
  }

  getDataCurrentWindow(): Observable<DataCurrentWindow> {
    return this._dataCurrentWindows$.asObservable();
  }

  setCurrentWindowPOST(formCurrentWindow: BodyCurrentWindowData) {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post(BASE_URL + 'current_window_data', formCurrentWindow, {
        headers: myHeaders,
      })

      .subscribe({
        next: (res: any) => {
          console.log({ res });
          this.store.dispatch(setDataCurrentWindow(res.currentWindowData));
        },
        error: (error) => console.log(error),
      });
  }

  setCurrentWindowPUT(formCurrentWindow: BodyCurrentWindowData) {
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    this.http
      .put(BASE_URL + 'current_window_data', formCurrentWindow, {
        headers: myHeaders,
      })
      .subscribe({
        next: (res) => {
          this.getCurrentWindow(formCurrentWindow.id_user.toString());
        },
        error: (error) => console.log(error),
      });
  }

  changeCurrentWindow(id: number) {
    this._current_window$.next(id);
  }

  LoadTextInformationFarmer(
    text: string,
    idTypeInformation: number
  ): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const userId: string = localStorage.getItem('@userId')!;
    const body = {
      id_user: userId,
      id_type_of_information: idTypeInformation,
      user_personal_description_text: text,
    };
    this.http
      .post(BASE_URL + 'user_information', body, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this._isErrorLoadAudioText$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorLoadAudioText$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });

    return this._isErrorLoadAudioText$.asObservable();
  }

  LoadTextInformation(
    text: string,
    idTypeInformation: number,
    currentWindow?: number
  ): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const userId: string = localStorage.getItem('@userId')!;
    const body = {
      id_user: userId,
      id_type_of_information: idTypeInformation,
      user_personal_description_text: text,
    };
    this.http
      .post(BASE_URL + 'user_information', body, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          if (currentWindow) {
            const bodyCurrentWindowData = {
              id_user: parseInt(userId!),
              current_window_id: 10,
              current_farm_number_lot: 0,
            };
            this.setCurrentWindowPOST(bodyCurrentWindowData);
          }

          this._isErrorLoadAudioText$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: (error) => {
          this._isErrorLoadAudioText$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });

    return this._isErrorLoadAudioText$.asObservable();
  }

  LoadTextInformationPUT(
    text: string,
    idTypeInformation: number
  ): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const userId: string = localStorage.getItem('@userId')!;
    const body = {
      id_user: userId,
      id_type_of_information: idTypeInformation,
      user_personal_description_text: text,
    };
    this.http
      .put(BASE_URL + 'modify_user_information', body, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this._isErrorLoadText$.next(false);
        },
        error: (error) => {
          this._isErrorLoadText$.next(true);
        },
      });
    this.store.dispatch(setIsLoading({ value: false }));
    return this._isErrorLoadText$.asObservable();
  }

  LoadTextInformationDashboard(
    text: string,
    idTypeInformation: number
  ): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const userId: string = localStorage.getItem('@userId')!;
    const body = {
      id_user: userId,
      id_type_of_information: idTypeInformation,
      user_personal_description_text: text,
    };
    this.http
      .post(BASE_URL + 'user_information', body, { headers: myHeaders })
      .subscribe({
        next: () => {
          this._isErrorLoadAudioText$.next(false);
          this.store.dispatch(setIsLoading({ value: false }));
        },
        error: () => {
          this._isErrorLoadAudioText$.next(true);
          this.store.dispatch(setIsLoading({ value: false }));
        },
      });
    return this._isErrorLoadAudioText$.asObservable();
  }

  setCoverPortadaPUT(form1AEdit: FormData): Observable<boolean> {
    this.store.dispatch(setIsLoading({ value: true }));
    const token = localStorage.getItem('@access_token')!;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .put(BASE_URL + 'cover_photo', form1AEdit, { headers: myHeaders })
      .subscribe({
        next: (response: any) => {
          this._isErrorCoverPortada$.next(true);
        },
        error: (error) => {
          this._isErrorCoverPortada$.next(false);
        },
      });
    this.store.dispatch(setIsLoading({ value: false }));
    return this._isErrorCoverPortada$.asObservable();
  }
}
