import { createReducer, on } from '@ngrx/store';
import { InitialStateErrorMessage } from '../model';
import {
  setIsErrorMessage,
  setShowErrorAlert,
} from '../actions/error-message.actions';

export const initialStateErrorMessage: InitialStateErrorMessage = {
  isError: false,
  message: '',
  good: false,
};

export const errorMessageRecuder = createReducer(
  initialStateErrorMessage,
  on(setShowErrorAlert, (state, { value }) => {
    return {
      ...state,
      isError: value,
    };
  }),
  on(setIsErrorMessage, (state, { message, good }) => {
    return {
      ...state,
      isError: true,
      message,
      good: good ? good : false,
    };
  })
);
