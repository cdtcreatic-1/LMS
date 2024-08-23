import { createAction, props } from '@ngrx/store';

export const changeCurrentWindowAdmin = createAction(
  '[Data ChangeCurrentWindow] changeCurrentWindow',
  props<{ value: number }>()
);
