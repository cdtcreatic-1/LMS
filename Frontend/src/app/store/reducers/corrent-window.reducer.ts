import { createReducer, on } from '@ngrx/store';
import { DataCurrentWindow } from 'src/app/register/interfaces';
import {
  changeCurrentWindow,
  changeCurrentWindowR,
  clearCurrentWindow,
  setDataCurrentWindow,
  setEmailVerification,
} from '../actions/current-window.actions';
import { InitialDatateCurrentWindow } from '../model';

export const initialStateDataFarmer: InitialDatateCurrentWindow = {
  dataCurrentWindow: undefined,
  actualCurrentWindow: 11,
  actualCurrentWindowR: 11.1,
  emailVerified: '',
};

export const currentWindowReducers = createReducer(
  initialStateDataFarmer,
  on(setDataCurrentWindow, (state, action: DataCurrentWindow) => {
    console.log(action.current_window_id);
    
    return {
      ...state,
      dataCurrentWindow: action,
      actualCurrentWindow: action.current_window_id,
    };
  }),

  on(changeCurrentWindow, (state, { value }) => {
    return {
      ...state,
      actualCurrentWindow: value,
    };
  }),

  on(changeCurrentWindowR, (state, { value }) => {
    return {
      ...state,
      actualCurrentWindowR: value,
    };
  }),
  on(setEmailVerification, (state, { email }) => {
    return {
      ...state,
      emailVerified: email,
    };
  }),

  on(clearCurrentWindow, (state) => {
    return {
      ...state,
      dataCurrentWindow: undefined,
      actualCurrentWindow: NaN,
      actualCurrentWindowR: NaN,
      emailVerified: '',
    };
  })
);
