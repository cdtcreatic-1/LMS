import { createAction, props } from '@ngrx/store';
import { DataCurrentWindow } from 'src/app/register/interfaces';

export const setDataCurrentWindow = createAction(
  '[Data Current Window] setDataCurrentWindow',
  props<DataCurrentWindow>()
);

export const changeCurrentWindow = createAction(
  '[Change Current Window] ChangeCurrentWindow',
  props<{ value: number }>()
);

export const changeCurrentWindowR = createAction(
  '[Change Current Window R] ChangeCurrentWindowR',
  props<{ value: number }>()
);

export const setEmailVerification = createAction(
  '[Change SetEmailVerification] setEmailVerification',
  props<{ email: string }>()
);

export const clearCurrentWindow = createAction(
  '[Clear CurrentWindow] ClearCurrentWindow'
);
