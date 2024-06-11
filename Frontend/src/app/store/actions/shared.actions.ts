import { createAction, props } from '@ngrx/store';
import { DataUserRegister, UserRoleExist } from 'src/app/shared/interfaces';

export const setDataRegisterShared = createAction(
  '[Data SetDataRegister] setDataRegister',
  props<{ data: DataUserRegister }>()
);

export const setDataQr = createAction(
  '[Data SetDataQr] setDataQr',
  props<{ url: string }>()
);

export const setUserRoles = createAction(
  '[Data SetUserRoles] setUserRoles',
  props<{ data: UserRoleExist[] }>()
);

export const setActualIdRol = createAction(
  '[Data SetActualIdRol] setActualIdRol',
  props<{ id: number }>()
);

export const clearShared = createAction('[Data ClearShared] clearShared');
