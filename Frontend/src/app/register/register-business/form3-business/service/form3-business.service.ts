import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Form3BusinessService {
  private _indexForm3Business$ = new Subject<number>();

  get getIndex(): Observable<number> {
    return this._indexForm3Business$.asObservable();
  }

  constructor() {}

  changeItemLetter(letter: number) {
    this._indexForm3Business$.next(letter);
  }
}
