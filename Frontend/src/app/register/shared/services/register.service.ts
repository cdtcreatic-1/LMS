import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private _indexIndicator$ = new Subject<number>();
  private _title$ = new Subject<string>();
  private _rol$ = new Subject<number>();
  private _rol: number;

  get getIndexIdicator(): Observable<number> {
    return this._indexIndicator$.asObservable();
  }

  get getTitle(): Observable<string> {
    return this._title$.asObservable();
  }

  get getRolRegister(): Observable<number> {
    return this._rol$.asObservable();
  }

  get getRol() {
    return this._rol;
  }

  constructor() {}

  changeIndexIndicator(index: number) {
    this._indexIndicator$.next(index);
  }

  changeTittle(text: string) {
    this._title$.next(text);
  }

  setRolRegister(rol: number) {
    this._rol$.next(rol);
    this._rol = rol;
  }
}
