export interface DataTraceability {
  message: string;
  purchaseData: {
    id_purchase: number;
    id_seller: number;
    purchase_quantity: number;
    purchase_created_at: string;
    shipping_address: string;
    additional_notes: string;
    Lot: {
      id_lot: number;
      lot_number: number;
      CoffeeProfile: {
        id_profile: number;
        profile_name: string;
      };
      CoffeeVariation: {
        id_variety: number;
        variety_name: string;
      };
      LotPhoto: {
        id_lot_photo: number;
        id_lot: number;
        lot_photo: string;
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
      RoastingType: {
        id_roast: number;
        roasting_name: string;
      };
      LotQuantity: {
        Association: {
          id_association: number;
          association_name: string;
          association_situation: boolean;
        };
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
    Buyer: {
      id_user: number;
      user_name: string;
      user_username: string;
      user_profile_photo: string;
      id_state: number;
    };
    Seller: {
      id_user: number;
      user_name: string;
      user_username: string;
      user_profile_photo: string;
    };
  };
}
