import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BASE_URL, BASE_URL_FRONTEND } from 'src/app/shared/constants';

declare const ePayco: any;

@Injectable({
  providedIn: 'root',
})
export class CarShopService {
  private _stateCarShop$ = new Subject<string>();

  get getStateCarShop(): Observable<string> {
    return this._stateCarShop$.asObservable();
  }

  constructor() {}

  setStateCarShop(state: string) {
    this._stateCarShop$.next(state);
  }

  initEpaycoButton(sessionId: string): void {
    if (typeof ePayco === 'undefined') {
      console.error('ePayco script not loaded!');
      return;
    }

    const handler = ePayco.checkout.configure({
      sessionId,
      test: false, // Cambia a false en producción,
    });

    handler.openNew();
  }
}
