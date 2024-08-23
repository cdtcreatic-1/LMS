import { createReducer, on } from '@ngrx/store';
import { InitialStateAddLots } from '../model';
import {
  clearStateAddLots,
  setCertificates,
  setPriceCoffee,
  setProfileTaza,
  setReviewCoffee,
  setTypeCoffee,
} from '../actions/add-lots.actions';

export const initialStateDataFarmer: InitialStateAddLots = {
  profileTazaName: '',
  formTypeCoffee: undefined,
  formPriceCoffee: undefined,
  formReviewCoffee: undefined,
  dataCertificates: undefined,
};

export const addLotsReducers = createReducer(
  initialStateDataFarmer,

  on(setTypeCoffee, (state, { form }) => {
    return {
      ...state,
      formTypeCoffee: form,
    };
  }),
  on(setProfileTaza, (state, { name }) => {
    return {
      ...state,
      profileTazaName: name,
    };
  }),
  on(setPriceCoffee, (state, { form }) => {
    return {
      ...state,
      formPriceCoffee: form,
    };
  }),
  on(setReviewCoffee, (state, { form }) => {
    return {
      ...state,
      formReviewCoffee: form,
    };
  }),
  on(setCertificates, (state, { data }) => {
    return {
      ...state,
      dataCertificates: data,
    };
  }),

  on(clearStateAddLots, (state) => {
    return {
      ...state,
      profileTazaName: '',
      formTypeCoffee: undefined,
      formPriceCoffee: undefined,
      formReviewCoffee: undefined,
      dataCertificates: undefined,
    };
  })
);
