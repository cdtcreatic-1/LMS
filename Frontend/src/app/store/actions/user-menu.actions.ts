import { createAction, props } from '@ngrx/store';
import {
  DataProfileCoffe,
  DataRegister,
  ResponseRegisterBusineeman,
} from 'src/app/register/register-farmer/interface';
import { DataTrends } from 'src/app/shared/interfaces';
import {
  DataLots,
  DataOffertLost,
} from 'src/app/profiles/businessman/body-businessman/interfaces';
import {
  DataProfileFarm,
  DataTableStateSell,
  LotSummary,
  Lots,
  ResponseDocumentFarmer,
  ResponseNotification,
  ResponseReconmendationPrice,
  ResponseTotalLots,
} from 'src/app/profiles/farmer/interfaces';

export const setDataRegister = createAction(
  '[Data Farmer] SetDataRegister',
  props<DataRegister>()
);

export const setDataFarm = createAction(
  '[Data Farm] SetDataFarm',
  props<{ data: DataProfileFarm[] }>()
);

export const setDataRegisterBusinessman = createAction(
  '[Data Businessman] SetDataRegisterBusinessman',
  props<{ data: ResponseRegisterBusineeman }>()
);

export const setActualIdRegisterLot = createAction(
  '[Data RegisterLots] SetActualIdRegisterLot',
  props<{ actualId: number }>()
);

export const setChangeActualIdDasboard = createAction(
  '[Data ChangeActualId] setChangeActualIdDasboard',
  props<{ actualId: number }>()
);

export const setFarmSelected = createAction(
  '[Data FarmSelected] setFarmSelected',
  props<{ farm: DataProfileFarm }>()
);

export const setNewNameVillage = createAction(
  '[Data NewNameFarm] setNewNameVillage',
  props<{ nameVillage: string }>()
);

export const setDataLotsByFarm = createAction(
  '[Data DataLotsByFarm] setDataLotsByFarm',
  props<{ allLots: ResponseTotalLots[] }>()
);

export const setDataPriceRecomendation = createAction(
  '[Data DataPriceRecomendation] setDataPriceRecomendation',
  props<{ dataPrice: ResponseReconmendationPrice }>()
);

export const setDataLots = createAction(
  '[Data Lots] SetDataLots',
  props<{ lots: Lots }>()
);

export const setDataNameCoffee = createAction(
  '[Data Name Coffee] SetDataNameCoffee',
  props<{ dataNameCoffee: DataProfileCoffe }>()
);

export const setDocumentsFarmer = createAction(
  '[Data documents] SetDocumentsFarmer',
  props<{ data: ResponseDocumentFarmer }>()
);

export const setNotificationFarmer = createAction(
  '[Data documents] SetNotificationFarmer',
  props<{ data: ResponseNotification[] }>()
);

export const setDataTableStateSell = createAction(
  '[Data documents] SetDataTableStateSell',
  props<{ data: DataTableStateSell[] }>()
);

export const setDataTrends = createAction(
  '[Data SetDataTrends] setDataTrends',
  props<{ data: DataTrends[] }>()
);

export const setSampleLot = createAction(
  '[Data SetSampleLot] setSampleLot',
  props<{ data: DataLots }>()
);

export const setOffertLost = createAction(
  '[Data SetSampleLot] setSampleLot',
  props<{ data: DataOffertLost[]; idBuyer: number }>()
);

export const setLotSelected = createAction(
  '[Data setLotSelected] setLotSelected',
  props<{ lot: LotSummary }>()
);

export const clearStore = createAction('[Clear Store] ClearStore');
