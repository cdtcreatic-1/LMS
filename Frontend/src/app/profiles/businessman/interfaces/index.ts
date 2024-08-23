import {
  CofeeProfiles,
  CoffeeVariety,
  Roasting,
  States,
} from 'src/app/register/register-farmer/interface';

export interface DataFarmers {
  id_user: number;
  name: string;
}

export interface IsSelects {
  isFarmers: boolean;
  isVarietyCoffee: boolean;
  isOriginCoffee: boolean;
}

export const DataFarmer: DataFarmers[] = [
  {
    id_user: 1,
    name: 'Cristian Tobar',
  },
  {
    id_user: 2,
    name: 'Maria Alejandra Fernandez Rosero',
  },
  {
    id_user: 3,
    name: 'Maggi Tobar Fernandez',
  },
];

export interface AvailablePriceRange {
  max_price: number;
  min_price: number;
}

export interface CoffeePropertiesInfo {
  available_profiles: CofeeProfiles[];
  available_roastes: Roasting[];
  available_varieties: CoffeeVariety[];
}

export interface DataSearhProduct {
  available_price_range: AvailablePriceRange;
  available_states: States[];
  coffee_properties_info: CoffeePropertiesInfo;
}

export interface ResponseItemDataSearch {
  message: string;
  data: DataSearhProduct;
}

export interface RequestDataSearchProduts {
  lot_properties: {
    id_variety: number[] | null;
    id_profile: number[] | null;
    id_roast: number[] | null;
  };
  price_range: {
    min_price: number | null;
    max_price: number | null;
  };
  id_state: number[] | null;
}

export interface ResponseDataSearchProducts {
  message: string;
  data: DataLot[];
}

export interface DataLot {
  farm_info: FarmInfo;
  id_lot: number;
  location_info: LocationInfo;
  lot_number: number;
  lot_photo: string;
  owner_info: OwnerInfo;
  properties_info: PropertiesInfo;
  quantity_info: QuantityInfo;
}

export interface FarmInfo {
  farm_name: string;
  id_farm: number;
}

export interface LocationInfo {
  city_name: string;
  id_city: number;
  id_state: number;
  id_village: number;
  state_name: string;
  village_name: string;
}

export interface OwnerInfo {
  id_user: number;
  user_name: string;
}

export interface PropertiesInfo {
  id_profile: number;
  id_roast: number;
  id_variety: number;
  profile_name: string;
  roasting_name: string;
  variety_name: string;
}

export interface QuantityInfo {
  price_per_kilo: number;
  samples_quantity: number;
  total_quantity: number;
}
