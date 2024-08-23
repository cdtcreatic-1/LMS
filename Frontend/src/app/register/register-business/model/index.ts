export interface FormRegiserBusinessman {
  id_user: number;
  type_document: number;
  document_number: number;
  postal_code: number;
  id_country: number;
  id_state: number;
}

export interface RegisterInterested {
  id_user: number;
  id_profile: number;
  id_roast: number;
  id_city: number;
}
