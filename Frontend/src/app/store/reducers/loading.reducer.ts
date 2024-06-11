import { createReducer, on } from '@ngrx/store';
import { InitialStateLoadinComponent } from '../model';
import { setIsLoading } from '../actions/loading.actions';

export const initialStateShared: InitialStateLoadinComponent = {
  isLoading: false,
};

export const loadingReducer = createReducer(
  initialStateShared,
  on(setIsLoading, (state, { value }) => {
    return {
      ...state,
      isLoading: value,
    };
  })
);
