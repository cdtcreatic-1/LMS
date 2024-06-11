import { createReducer, on } from '@ngrx/store';
import { InitialStateShared } from '../model';
import {
  clearShared,
  setActualIdRol,
  setDataQr,
  setDataRegisterShared,
  setUserRoles,
} from '../actions/shared.actions';

export const initialStateShared: InitialStateShared = {
  dataUserRegister: undefined,
  dataQr: '',
  dataRoles: [],
  actualIdRole: NaN,
};

export const sharedReducer = createReducer(
  initialStateShared,
  on(setDataRegisterShared, (state, { data }) => {
    return {
      ...state,
      dataUserRegister: data,
    };
  }),
  on(setDataQr, (state, { url }) => {
    return {
      ...state,
      dataQr: url,
    };
  }),
  on(setUserRoles, (state, { data }) => {
    return {
      ...state,
      dataRoles: data,
    };
  }),
  on(setActualIdRol, (state, { id }) => {
    return {
      ...state,
      actualIdRole: id,
    };
  }),
  on(clearShared, (state) => {
    return {
      ...state,
      dataUserRegister: undefined,
      dataQr: '',
      actualIdRole: NaN,
      dataRoles: [],
    };
  })
);
