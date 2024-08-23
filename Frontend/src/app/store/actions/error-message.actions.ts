import { createAction, props } from '@ngrx/store';
import { DataCurrentWindow } from 'src/app/register/interfaces';

export const setShowErrorAlert = createAction(
  '[Data SetShowErrorAlert] setShowErrorAlert',
  props<{ value: boolean }>()
);

export const setIsErrorMessage = createAction(
  '[Data SetIsErrorMessage] setIsErrorMessage',
  props<{ message: string; good?: boolean }>()
);
