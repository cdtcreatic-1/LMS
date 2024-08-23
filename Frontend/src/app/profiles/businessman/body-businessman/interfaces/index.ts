export interface DataLots {
  id_farm: number;
  id_lot: number;
  LotQuantity: {
    price_per_kilo: number;
  };
  CoffeeProfile: {
    profile_name: string;
  };
  LotPhoto: {
    lot_photo: string;
  };
  ScoreLot: null;
}

export interface Farmers {
  id_user: number;
  user_name: string;
  user_phone: string;
  user_email: string;
  user_username: string;
  user_cover_photo: null | string;
  user_profile_photo: string;
  user_personal_description_text: string;
  id_type_of_information: number;
  profile_name: string;
  farm_name: string;
}

export interface DataFarmerSelected {
  user_name: string;
  farm_name: string;
  path_photo: string;
  description_text: string;
  id_farmer: number;
}

export interface DataCarShop {
  id_cart: number;
  id_buyer: number;
  id_seller: number;
  quantity: number;
  Lot: {
    id_lot: number;
    lot_number: number;
    id_farm: 1;
    CoffeeVariation: {
      id_variety: number;
      variety_name: string;
    };
    CoffeeProfile: {
      id_profile: number;
      profile_name: string;
    };
    LotQuantity: {
      id_association: number;
      id_lot_quantity: number;
      id_lot: number;
      total_quantity: number;
      samples_quantity: number;
      price_per_kilo: number;
    };
    LotPhoto: {
      id_lot_photo: number;
      id_lot: number;
      lot_photo: string;
    };
    RoastingType: {
      id_roast: number;
      roasting_name: string;
    };
    LotSummary: {
      id_lot_summary: number;
      id_lot: number;
      germination_summary: string;
      sown_summary: string;
      harvest_summary: string;
      drying_summary: string;
      roasting_summary: string;
      packaging_summary: string;
    };
  };
}

export interface DataRequestCarShop {
  id_cart: number;
  is_sample: boolean;
  purchase_quantity: number;
}

export interface DataNotificationBusinessman {
  id_make_offer: number;
  id_buyer: number;
  offer_created_at: string;
  offer_updated_at: null;
  offer_deleted_at: null;
  Lot: {
    id_lot: number;
    lot_number: number;
    id_farm: number;
    lot_created_at: string;
    lot_updated_at: null;
    lot_deleted_at: null;
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
    LotPhoto: {
      id_lot_photo: number;
      id_lot: number;
      lot_photo: string;
    };
    ScoreLot: null;
    LotSummary: {
      id_lot_summary: number;
      id_lot: number;
      germination_summary: string;
      sown_summary: string;
      harvest_summary: string;
      drying_summary: string;
      roasting_summary: string;
      packaging_summary: string;
    };
    LotQuantity: {
      id_lot_quantity: number;
      id_lot: number;
      total_quantity: number;
      samples_quantity: number;
      id_association: number;
      price_per_kilo: number;
      lot_quantity_created_at: string;
      lot_quantity_updated_at: number | null;
      lot_quantity_deleted_at: number | null;
    };
  };
  Seller: {
    id_user: number;
    user_name: string;
    user_profile_photo: string;
  };
  OfferStatus: {
    id_offer_status: number;
    offer_status_name: string;
  };
}

export interface ResponseNotificationBusinessman {
  message: 'Offers retrieved successfully';
  processedOffers: DataNotificationBusinessman[];
}

export interface RequestPurchase {
  id_shipping_option: number;
  shipping_address: string;
  additional_notes: string;
}

export interface DataOffertLost {
  cup_profile_name: string;
  id_lot: number;
  lot_number: number;
  lot_photo: string;
  lot_price: number;
  lot_score: number;
}

export interface ResponsePurchase {
  message: string;
  session_id: string;
}
