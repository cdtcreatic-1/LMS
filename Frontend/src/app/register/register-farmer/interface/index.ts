export interface InitialFormValuesRegister {
  business: string;
  email: string;
  password: string;
  confirmPassword: string;
  state: string;
}

export interface ReponseRegister {
  id_user: number;
  token: string;
  fex_version: string;
}

export interface BodyCurrentWindowData {
  id_user: number;
  current_window_id: number;
  current_farm_number_lot: number;
}

export interface Lots {
  id: number;
  isSelected: boolean;
}

export interface Asociation {
  id_association: number;
  association_name: string;
  association_situation: boolean;
}

export interface Roasting {
  id_roast: number;
  roasting_name: string;
}

export interface CoffeeVariety {
  id_variety: number;
  variety_name: string;
}

export interface CofeeProfiles {
  id_profile: number;
  profile_name: string;
}

export interface DataProfileCoffe {
  message: string;
  associations: Asociation[];
  roastingTypes: Roasting[];
  coffeeVariations: CoffeeVariety[];
  coffeeProfiles: CofeeProfiles[];
}

// Form register interface

export interface Form1ARegisterFarmer {
  user_name: string;
  user_phone: string;
  user_email: string;
  user_password: string;
  user_confirm_password: string;
  user_username: string;
  user_profile_photo: string;
}

export interface Countries {
  country_iso2: string;
  country_iso3: string;
  country_name_en: string;
  country_name_es: string;
  country_numericcode: string;
  country_phonecode: string;
  id_country: 1;
}

export interface States {
  id_state: number;
  id_country: number;
  state_name: string;
}

export interface ResponseStates {
  message: string;
  states: States[];
}

export interface Cities {
  id_city: number;
  id_state: number;
  city_name: string;
  State: {
    id_state: number;
    id_country: number;
    state_name: string;
    Country: {
      id_country: number;
      country_name: string;
    };
  };
}

export interface Villages {
  id_village: number;
  id_city: number;
  village_name: string;
}

export interface InitialFormValuesFormRegisterFarmerb {
  nameFarm: string;
  numberLots: string;
  state: string;
  city: string;
  village: string;
  wather: string;
  heigth: string;
}

export interface RequeestCoordinates {
  id_state: number | string | null;
  id_city: number | string | null;
  id_village: number | string | null;
}

export interface RequestLonLat {
  latitude: number;
  longitude: number;
}

export interface ReponseDataCoordinates {
  bbox: {
    xmax: number;
    xmin: number;
    ymax: number;
    ymin: number;
  };
  centroid: {
    x: number;
    y: number;
  };
  entity_name: string;
  status: string;
}

export interface ResponseIdsByCoordinates {
  id_state: number;
  id_city: number;
  id_village: number;
}

export interface FormRegisterFarm {
  nameFarm: string;
  city: string;
  village: string;
  numberLots: number;
  farmLongitude: number;
  farmLatitude: number;
  newNameVillage: string;
}

export interface DataUserFarmer {
  user_name: string;
  user_phone: string;
  user_email: string;
  user_username: string;
  user_cover_photo: null;
  user_profile_photo: string;
}

export interface DataRegister {
  user_personal_description_text: string;
  id_type_of_information: number;
  User: DataUserFarmer;
  farm_name: string;
}

export interface ResponseRegisterFarm {
  message: string;
  farmSaved: {
    farm_created_at: string;
    id_farm: number;
    id_user: number;
    farm_name: string;
    farm_number_lots: number;
    id_village: number;
    farm_longitude: number;
    farm_latitude: number;
    farm_updated_at: string | null;
    farm_deleted_at: string | null;
  };
}

export interface ResponseRegisterFarmer {
  id_user: number;
  user_name: string;
  user_phone: string;
  user_email: string;
  user_username: string;
  number_document: string;
  postal_code: number;
  id_state: number;
  user_profile_photo: string;
  user_country: string;
}
export interface ResponseRegisterBusineeman {
  id_user: number;
  user_name: string;
  user_phone: string;
  user_email: string;
  user_username: string;
  number_document: string;
  postal_code: number;
  id_state: number;
  user_profile_photo: string;
  id_country: number;
  user_country: string;
}

export interface RequestAditionalInformation {
  id_farm: number;
  altitude: number;
  climate: string;
  temperature: string;
}

export interface ResponseClimateAndTemperature {
  message: string;
  data: {
    altitude: number;
    climate: string;
    temperature: string;
  };
}

export interface DataModalCllimate extends ResponseClimateAndTemperature {
  stateName?: string;
  cityName?: string;
  villageName?: string;
  isRegister: boolean;
}

export interface RequestAddVillageName {
  id_city: number;
  village_name: string;
}
