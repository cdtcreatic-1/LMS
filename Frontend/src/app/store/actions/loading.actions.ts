import { createAction, props } from '@ngrx/store';

export const setIsLoading = createAction(
  '[Data SetIsGlobalLoading] setIsGlobalLoading',
  props<{ value: boolean }>()
);
