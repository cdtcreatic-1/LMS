import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuLateralService {
  private _isAccordion$ = new Subject<boolean>();
  private _itemMenuLateral$ = new Subject<number>();

  get getisAccordion() {
    return this._isAccordion$.asObservable();
  }

  get getItemMenuLateral() {
    return this._itemMenuLateral$.asObservable();
  }

  constructor() {}

  setisAcordion(value: boolean) {
    this._isAccordion$.next(value);
  }

  setItemMenuLateral(id: number) {
    this._itemMenuLateral$.next(id);
  }
}
