export interface FormTypeCoffee {
  id_farm: number;
  lot_number: number;
  id_variety: number;
  id_profile: number;
  id_roast: number;
}

export interface ResponseRegisterLot {
  message: string;
  lot_id: {
    lot_created_at: string;
    id_lot: number;
    id_farm: number;
    lot_number: number;
    id_variety: number;
    id_profile: number;
    id_roast: number;
    lot_updated_at: string | null;
    lot_deleted_at: string | null;
  };
}

export interface FormPriceCoffee {
  id_lot: number;
  total_quantity: number;
  samples_quantity: number;
  id_association: number;
  price_per_kilo: number;
}

export interface ResponseFormPriceCoffee {
  message: string;
  id_lot_quantity: number;
  id_lot: number;
  total_quantity: number;
  samples_quantity: number;
  id_association: number;
  price_per_kilo: number;
}

export interface FormReviewCoffee {
  id_lot: number;
  germination_summary: string;
  drying_summary: string;
  harvest_summary: string;
  packaging_summary: string;
  roasting_summary: string;
  sown_summary: string;
}

export interface ResponseReviewCoffee {
  message: string;
  Lot_summary: {
    id_lot_summary: number;
    id_lot: number;
    germination_summary: string;
    sown_summary: string;
    harvest_summary: string;
    drying_summary: string;
    roasting_summary: string;
    packaging_summary: string;
  };
}

export interface FormCertificates {
  dataImageTest: any;
  pathImageTest: string;
  dataImageCatador: any;
  pathImageCatador: string;
  dataRequest: FormData;
}

export interface ResponseCertifications {
  message: string;
  lotCertification: {
    id_lot_certifications: number;
    id_lot: number;
    product_sc_certificate: string;
    product_taster_certificate: string;
    contact_qgrader: boolean;
  };
}

export interface ResponseLoadPhoto {
  message: string;
  newLotPhoto: {
    id_lot_photo: number;
    id_lot: number;
    lot_photo: string;
  };
}
