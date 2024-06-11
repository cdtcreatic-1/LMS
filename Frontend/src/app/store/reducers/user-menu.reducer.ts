import { createReducer, on } from '@ngrx/store';
import {
  clearStore,
  setActualIdRegisterLot,
  setChangeActualIdDasboard,
  setDataFarm,
  setDataLots,
  setDataLotsByFarm,
  setDataNameCoffee,
  setDataPriceRecomendation,
  setDataRegister,
  setDataRegisterBusinessman,
  setDataTableStateSell,
  setDataTrends,
  setDocumentsFarmer,
  setFarmSelected,
  setLotSelected,
  setNewNameVillage,
  setNotificationFarmer,
  setOffertLost,
  setSampleLot,
} from '../actions/user-menu.actions';
import { FarmerProfile } from '../model';
import { DataRegister } from 'src/app/register/register-farmer/interface';

export const initialStateDataFarmer: FarmerProfile = {
  dataFarm: [],
  dataRegister: undefined,
  dataCoffeeName: undefined,
  dataLots: [],
  dataDocuments: undefined,
  actualIdRegisterLots: 2.1,
  actualId: 1,
  newNameVillage: '',
  farmSelected: undefined,
  dataLotsByFarm: [],
  dataPriceRecomendation: undefined,
  dataRegisterBusinessman: undefined,
  dataNotificationFarmer: [],
  dataTableStateSell: [],
  dataTrends: [],
  dataSampleLot: undefined,
  dataOffertLots: [],
  idBuyerSelected: NaN,
  lotSelected: undefined,
};

export const dataFarmerProfile = createReducer(
  initialStateDataFarmer,
  on(setDataRegister, (state, action: DataRegister) => {
    return {
      ...state,
      dataRegister: action,
    };
  }),
  on(setDataFarm, (state, { data }) => {
    // It is provitional, whem is send correct response boolean

    const newData = data.filter((res) => res.farm_status === 'True');

    return { ...state, dataFarm: newData };
  }),
  on(setDataNameCoffee, (state, { dataNameCoffee }) => {
    return {
      ...state,
      dataCoffeeName: dataNameCoffee,
    };
  }),
  on(setDataLots, (state, { lots }) => {
    const lotsRef = [...state.dataLots];

    const resProfile = state.dataCoffeeName?.coffeeProfiles.filter(
      (item) => item.id_profile === lots.id_profile
    );

    const resVariety = state.dataCoffeeName?.coffeeVariations.filter(
      (item) => item.id_variety === lots.id_variety
    );

    const resAsociation = state.dataCoffeeName?.associations.filter(
      (item) => item.id_association === lots.id_association
    );

    const resRoast = state.dataCoffeeName?.roastingTypes.filter(
      (item) => item.id_roast === lots.id_roast
    );

    lotsRef.push({
      ...lots,
      id_profile: resProfile![0].profile_name,
      id_variety: resVariety![0].variety_name,
      id_association: resAsociation![0].association_name,
      id_roast: resRoast![0].roasting_name,
    });
    return {
      ...state,
      dataLots: lotsRef,
    };
  }),
  on(setDocumentsFarmer, (state, { data }) => {
    return {
      ...state,
      dataDocuments: data,
    };
  }),
  on(setActualIdRegisterLot, (state, { actualId }) => {
    return {
      ...state,
      actualIdRegisterLots: actualId,
    };
  }),
  on(setChangeActualIdDasboard, (state, { actualId }) => {
    return {
      ...state,
      actualId: actualId,
    };
  }),
  on(setNewNameVillage, (state, { nameVillage }) => {
    return {
      ...state,
      newNameVillage: nameVillage,
    };
  }),
  on(setFarmSelected, (state, { farm }) => {
    return {
      ...state,
      farmSelected: farm,
    };
  }),
  on(setDataLotsByFarm, (state, { allLots }) => {
    return {
      ...state,
      dataLotsByFarm: allLots,
    };
  }),
  on(setDataPriceRecomendation, (state, { dataPrice }) => {
    // const newPrice: ResponseReconmendationPrice = {
    //   lower_price: dataPrice.lower_price,
    //   recommended_price: dataPrice.recommended_price,
    //   higher_price: dataPrice.higher_price,
    // };

    return {
      ...state,
      dataPriceRecomendation: dataPrice,
    };
  }),
  on(setDataRegisterBusinessman, (state, { data }) => {
    return {
      ...state,
      dataRegisterBusinessman: data,
    };
  }),
  on(setNotificationFarmer, (state, { data }) => {
    return {
      ...state,
      dataNotificationFarmer: data,
    };
  }),
  on(setDataTableStateSell, (state, { data }) => {
    return {
      ...state,
      dataTableStateSell: data,
    };
  }),
  on(setDataTrends, (state, { data }) => {
    return {
      ...state,
      dataTrends: data,
    };
  }),
  on(setSampleLot, (state, { data }) => {
    return {
      ...state,
      dataSampleLot: data,
    };
  }),
  on(setOffertLost, (state, { data, idBuyer }) => {
    return {
      ...state,
      dataOffertLots: data,
      idBuyerSelected: idBuyer,
    };
  }),
  on(setLotSelected, (state, { lot }) => {
    return {
      ...state,
      lotSelected: lot,
    };
  }),

  on(clearStore, (state) => {
    return {
      ...state,
      dataFarm: [],
      dataRegister: undefined,
      dataCoffeeName: undefined,
      dataLots: [],
      dataDocuments: undefined,
      actualIdRegisterLots: 2.1,
      actualId: 1,
      newNameFarm: '',
      farmSelected: undefined,
      dataLotsByFarm: [],
      dataPriceRecomendation: undefined,
      dataRegisterBusinessman: undefined,
      dataNotificationFarmer: [],
      dataTableStateSell: [],
    };
  })
);
