import { createAction, props } from '@ngrx/store';
import {
  FormCertificates,
  FormPriceCoffee,
  FormReviewCoffee,
  FormTypeCoffee,
} from 'src/app/profiles/farmer/body-farmer/add-lots/interfaces';

export const setProfileTaza = createAction(
  '[Data SetProfileTaza] setProfileTaza',
  props<{ name: string }>()
);

export const setTypeCoffee = createAction(
  '[Data SetTypeCoffee] setTypeCoffee',
  props<{ form: FormTypeCoffee }>()
);

export const setPriceCoffee = createAction(
  '[Data SetPriceCoffee] setPriceCoffee',
  props<{ form: FormPriceCoffee }>()
);

export const setReviewCoffee = createAction(
  '[Data SetReviewCoffee] setReviewCoffee',
  props<{ form: FormReviewCoffee }>()
);

export const setCertificates = createAction(
  '[Data SetCertificates] setCertificates',
  props<{ data: FormCertificates }>()
);

export const clearStateAddLots = createAction(
  '[Data ClearStateAddLots] clearStateAddLots'
);
