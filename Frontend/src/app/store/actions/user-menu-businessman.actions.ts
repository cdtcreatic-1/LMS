import { createAction, props } from '@ngrx/store';
import { DataTrendFarmers } from 'src/app/shared/interfaces';
import {
  DataCarShop,
  DataFarmerSelected,
  DataLots,
  DataNotificationBusinessman,
  Farmers,
} from 'src/app/profiles/businessman/body-businessman/interfaces';
import { DataTableStateSell } from 'src/app/profiles/farmer/interfaces';
import {
  DataSearhProduct,
  ResponseDataSearchProducts,
} from 'src/app/profiles/businessman/interfaces';

export const setDocumentBusinessman = createAction(
  '[Set Documents] SetDocuments',
  props<{ path: string }>()
);

export const setDataFarmers = createAction(
  '[Set SetDataFarmers] SetDataFarmers',
  props<{ data: Farmers[] }>()
);

export const setIdFarmSelected = createAction(
  '[Set SetIdFarmSelected] SetIdFarmSelected',
  props<{ id: number }>()
);

export const setDataLotsBusinessman = createAction(
  '[Set SetDataLotsBusinessman] setDataLotsBusinessman',
  props<{ data: DataLots[] }>()
);

export const setDataFarmerSelected = createAction(
  '[Set SetDataFarmerSelected] setDataFarmerSelected',
  props<{ data: DataFarmerSelected }>()
);

export const setNotificationBusinessman = createAction(
  '[Set SetNotificationBusinessman] setNotificationBusinessman',
  props<{ data: DataNotificationBusinessman[] }>()
);

export const setDataCarShop = createAction(
  '[Set SetDataCarShop] setDataCarShop',
  props<{ data: DataCarShop[] }>()
);

export const setCountCarShop = createAction(
  '[Set SetCountCarShop] setCountCarShop',
  props<{ idCar: number; status: number }>()
);

export const setDataLotDescription = createAction(
  '[Set SetDataLotDescription] setDataLotDescription',
  props<{ data: DataNotificationBusinessman }>()
);

export const setDataTableBusinessman = createAction(
  '[Data documents] SetDataTableStateSell',
  props<{ data: DataTableStateSell[] }>()
);

export const setDataTrendsFarmer = createAction(
  '[Data SetDataTrends] setDataTrends',
  props<{ data: DataTrendFarmers[] }>()
);

export const setStatusPayment = createAction(
  '[Data SetStatusPayment] setStatusPayment',
  props<{ value: number }>()
);

export const setDataSearchProducts = createAction(
  '[Data SetDataSearchProducts] setDataSearchProducts',
  props<{ data: DataSearhProduct }>()
);

export const setOnChangeDataProducts = createAction(
  '[Data SetOnChangeDataProducts] setOnChangeDataProducts',
  props<{ id: number; item: any }>()
);

export const setOnChangePrices = createAction(
  '[Data SetOnChangePrices] setOnChangePrices',
  props<{ id: number; value: number }>()
);

export const setShowModalSearchProducts = createAction(
  '[Data SetShowModalSearchProducts] setShowModalSearchProducts',
  props<{ value: boolean }>()
);

export const setResponseSearchProducts = createAction(
  '[Data SetResponseSearchProducts] setResponseSearchProducts',
  props<{ data?: ResponseDataSearchProducts }>()
);

export const setCleanFilter = createAction(
  '[Data SetCleanFilter] setCleanFilter'
);
