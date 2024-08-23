import { createReducer, on } from '@ngrx/store';
import { InitialStateMenuBusinessman } from '../model';
import {
  setDocumentBusinessman,
  setDataFarmers,
  setIdFarmSelected,
  setDataLotsBusinessman,
  setDataFarmerSelected,
  setDataCarShop,
  setNotificationBusinessman,
  setDataLotDescription,
  setDataTableBusinessman,
  setDataTrendsFarmer,
  setCountCarShop,
  setStatusPayment,
  setDataSearchProducts,
  setShowModalSearchProducts,
  setResponseSearchProducts,
  setOnChangeDataProducts,
  setOnChangePrices,
  setCleanFilter,
} from '../actions/user-menu-businessman.actions';
import {
  CoffeeVariety,
  States,
} from 'src/app/register/register-farmer/interface';

export const initialStateMemuBusinessman: InitialStateMenuBusinessman = {
  pathDocument: '',
  dataFarmers: [],
  idFarmSelected: NaN,
  dataLots: [],
  dataFarmerSelected: undefined,
  dataCarShop: [],
  totalPriceCarShop: 0,
  dataNotification: [],
  dataLotDescription: undefined,
  dataTableBusinessman: [],
  dataTrends: [],
  idStatusPayment: NaN,
  dataSearchProduct: undefined,
  dataReponseSearchProducts: undefined,
  showModalSearchPrice: false,
  dataCoffeeVariety: [],
  dataStates: [],
  rangePrice: undefined,
  minPrice: NaN,
  maxPrice: NaN,
};

export const ProfileBusinessman = createReducer(
  initialStateMemuBusinessman,
  on(setDocumentBusinessman, (state, { path }) => {
    return {
      ...state,
      pathDocument: path,
    };
  }),
  on(setDataFarmers, (state, { data }) => {
    return {
      ...state,
      dataFarmers: data,
    };
  }),
  on(setDataLotsBusinessman, (state, { data }) => {
    return {
      ...state,
      dataLots: data,
    };
  }),
  on(setDataFarmerSelected, (state, { data }) => {
    return {
      ...state,
      dataFarmerSelected: data,
    };
  }),
  on(setDataCarShop, (state, { data }) => {
    let totalPrice: number = 0;
    const newData = data.map((item) => {
      totalPrice += 2 * item.Lot.LotQuantity?.price_per_kilo;
      return { ...item, quantity: 2 };
    });

    return {
      ...state,
      dataCarShop: newData,
      totalPriceCarShop: totalPrice,
    };
  }),
  on(setCountCarShop, (state, { idCar, status }) => {
    let totalPrice: number = 0;
    const newData = state.dataCarShop.map((item) => {
      if (item.id_cart === idCar) {
        if (item.Lot.LotQuantity.id_lot_quantity === 2 && status < 0) {
          totalPrice = item.Lot.LotQuantity.price_per_kilo * 2;
          return { ...item, quantity: 2 };
        }
        let count = item.quantity;

        if (status > 0) {
          count += 1;

          totalPrice += count * item.Lot.LotQuantity.price_per_kilo * 2;
        } else {
          count -= 1;
          totalPrice =
            count * item.Lot.LotQuantity.price_per_kilo * 2 - totalPrice;
        }

        return { ...item, quantity: count };
      } else {
        totalPrice +=
          item.Lot.LotQuantity.id_lot_quantity *
          item.Lot.LotQuantity.price_per_kilo;
        return { ...item };
      }
    });

    return {
      ...state,
      dataCarShop: newData,
      totalPriceCarShop: totalPrice,
    };
  }),

  on(setIdFarmSelected, (state, { id }) => {
    return {
      ...state,
      idFarmSelected: id,
    };
  }),
  on(setNotificationBusinessman, (state, { data }) => {
    return {
      ...state,
      dataNotification: data,
    };
  }),
  on(setDataLotDescription, (state, { data }) => {
    return {
      ...state,
      dataLotDescription: data,
    };
  }),
  on(setDataTableBusinessman, (state, { data }) => {
    return {
      ...state,
      dataTableBusinessman: data,
    };
  }),
  on(setDataTrendsFarmer, (state, { data }) => {
    return {
      ...state,
      dataTrends: data,
    };
  }),
  on(setStatusPayment, (state, { value }) => {
    return {
      ...state,
      idStatusPayment: value,
    };
  }),
  on(setDataSearchProducts, (state, { data }) => {
    const dataCoffeeVariety =
      data.coffee_properties_info.available_varieties.map((item) => {
        return { ...item, isSelected: false };
      });

    const dataStates = data.available_states.map((item) => {
      return { ...item, isSelected: false };
    });

    const rangePrice = {
      min: data.available_price_range.min_price,
      max: data.available_price_range.max_price,
    };

    return {
      ...state,
      dataCoffeeVariety,
      dataStates,
      rangePrice,
      minPrice: data.available_price_range.min_price,
      maxPrice: data.available_price_range.max_price,
      dataSearchProduct: data,
    };
  }),
  on(setOnChangeDataProducts, (state, { id, item }) => {
    let newDataCoffeeVariety: (CoffeeVariety & { isSelected: boolean })[] = [];
    let newdataStates: (States & { isSelected: boolean })[] = [];

    if (id === 2) {
      newDataCoffeeVariety = state.dataCoffeeVariety.map((cofeeVariety) => {
        if (cofeeVariety.id_variety === item.id_variety) {
          return { ...cofeeVariety, isSelected: !cofeeVariety.isSelected };
        }
        return cofeeVariety;
      });
    } else if (id === 3) {
      newdataStates = state.dataStates.map((state) => {
        if (state.id_state === item.id_state) {
          return { ...state, isSelected: !state.isSelected };
        }
        return state;
      });
    }
    return {
      ...state,
      dataCoffeeVariety:
        id === 2 ? newDataCoffeeVariety : state.dataCoffeeVariety,
      dataStates: id == 3 ? newdataStates : state.dataStates,
    };
  }),
  on(setOnChangePrices, (state, { id, value }) => {
    const rangePrice = {
      min: id == 1 ? value : state.rangePrice?.min!,
      max: id === 2 ? value : state.rangePrice?.max!,
    };

    return {
      ...state,
      rangePrice,
    };
  }),
  on(setShowModalSearchProducts, (state, { value }) => {
    return {
      ...state,
      showModalSearchPrice: value,
    };
  }),
  on(setResponseSearchProducts, (state, { data }) => {
    return {
      ...state,
      dataReponseSearchProducts: data,
    };
  }),
  on(setCleanFilter, (state) => {
    const dataCoffeeVariety = state.dataCoffeeVariety.map((item) => {
      return { ...item, isSelected: false };
    });

    const dataStates = state.dataStates.map((item) => {
      return { ...item, isSelected: false };
    });

    const rangePrice = {
      min: state.minPrice,
      max: state.maxPrice,
    };

    return {
      ...state,
      dataCoffeeVariety,
      dataStates,
      rangePrice,
    };
  })
);
