export interface ResponseDataFarms {
  farms_info: DataProfileFarm[];
}

export interface DataProfileFarm {
  altitude: number;
  city_name: string;
  climate: string;
  farm_name: string;
  farm_number_lots: number;
  id_city: number;
  id_farm: number;
  id_state: number;
  farm_status: string;
  id_user: number;
  id_village: number;
  name_provided_by_user: null;
  state_name: string;
  temperature: string;
  village_name: string;
  is_in_purchase: boolean;
}

export interface FarmPhotos {
  id_farm: number;
  farm_photo_1: string;
  farm_photo_2: string;
  farm_photo_3: string;
}

export interface Lots {
  id_lots: number;
  lot_number: number;
  id_variety: number | string;
  id_profile: number | string;
  id_association: number | string;
  product_avaliable_amount: number;
  id_roast: number | string;
  product_production_description_text: string;
  product_production_description_audio: null;
  id_farm: number;
  price_per_kilo: number;
  farm_photo: string | null;
}

export interface DataLotsFarmer {
  lots: Lots;
}

export interface LotsQuantity {
  total_quantity: number;
  samples_quantity: 4545;
  Association: {
    association_name: string;
  };
}

export interface LotSummary {
  germination_summary: string;
  sown_summary: string;
  harvest_summary: string;
  drying_summary: string;
  roasting_summary: string;
  packaging_summary: string;
}

export interface ResponseTotalLots {
  id_lot: 1;
  is_in_purchase: boolean;
  CoffeeProfile: {
    profile_name: string;
  };
  CoffeeVariation: {
    variety_name: string;
  };
  RoastingType: {
    roasting_name: string;
  };
  LotPhoto: {
    lot_photo: string;
  };
  LotQuantity: LotsQuantity;
  LotSummary: LotSummary;
}

export interface ResponseReconmendationPrice {
  higher_price: number;
  lower_price: number;
  recommended_price: number;
}

export interface ResponseDocumentFarmer {
  id_farm_documentation: number;
  id_farm: number;
  farm_documentation_id_document: string;
  farm_documentation_rut: string;
  farm_documentation_chamber_commerce: string;
}

export interface ResponseNotification {
  id_purchase: number;
  purchase_quantity: number;
  Lot: {
    id_lot: number;
    lot_number: number;
    CoffeeVariation: {
      id_variety: number;
      variety_name: string;
    };
    CoffeeProfile: {
      id_profile: number;
      profile_name: string;
    };
    RoastingType: {
      id_roast: number;
      roasting_name: string;
    };
  };
  Buyer: {
    id_user: number;
    user_name: string;
    user_username: string;
    user_profile_photo: string;
    id_state: number;
  };
  PurchaseOption: {
    id_purchase_status: number;
    status_name: string;
  };
  ShippingOption: {
    id_shipping_option: number;
    shipping_option_name: string;
    shipping_option_price: number;
  };
}

export interface DataTableStateSell {
  tipo: string;
  fecha: string;
  cantidad: number;
  estado: string;
  id_purchase: number;
  lot_number: number;
  precio: number;
  vendedor: string;
}
