import { createReducer, on } from '@ngrx/store';
import { InitialStateAdmin, InitialStateShared } from '../model';
import { changeCurrentWindowAdmin } from '../actions/admin.actions';

export const initialStateShared: InitialStateAdmin = {
  actualIdWindow: 1,
};

export const adminReducer = createReducer(
  initialStateShared,
  on(changeCurrentWindowAdmin, (state, { value }) => {
    return {
      ...state,
      actualIdWindow: value,
    };
  })
);
