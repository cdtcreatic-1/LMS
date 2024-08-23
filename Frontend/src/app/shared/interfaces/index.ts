export interface DataUserRegister {
  id_user: number;
  user_name: string;
  user_phone: string;
  user_email: string;
  user_username: string;
  number_document: string;
  postal_code: number;
  id_state: number;
  user_profile_photo: string | null;
  user_cover_photo: string | null;
  id_role: number;
  user_country: string;
  id_country: number;
  user_created: {
    id_user_created: number;
  };
  hasDocumentation: boolean;
  learning_style: string | null;
  skills: any[];
}

export interface RequestChangePassword {
  id_user: string;
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface DataCoffee {
  name: string;
  quantity: number;
  percent: number;
  color: string;
}

// Buyer in trends

export interface ResponseBuyerTrens {
  ranking: DataTrends[];
}

export interface DataTrends {
  chart_paths: ChartPaths;
  id_user: number;
  stats: Stats;
  user_name: string;
  user_profile_photo: string;
}

export interface ChartPaths {
  chart_profile_path: string;
  chart_roast_path: string;
  chart_variety_path: string;
}

export interface Stats {
  profile: Profile[];
  roast: Profile[];
  total_quantity: number;
  variety: Profile[];
}

export interface Profile {
  color: string;
  name: string;
  percent: number;
  quantity: number;
}

// Farmer in trens

export interface ResponseFarmersTrends {
  status: string;
  ranking: DataTrendFarmers[];
}

export interface Data {
  ranking: DataTrendFarmers[];
}

export interface DataTrendFarmers {
  id_user: number;
  lots: LotDataTrend[];
  total_purchase_quantity: number;
  user_name: string;
  user_profile_photo: string;
}

export interface LotDataTrend {
  id_lot: number;
  lot_photo: string;
  profile_name: string;
  roasting_name: string;
  sales_quantity: number;
  variety_name: string;
  newBackgroud: {
    background: string;
  };
}

export interface ResponseVerifyToken {
  valid: true;
  id_user: number;
  id_role: number;
  token: string;
}

export interface ResponseUserRoles {
  message: string;
  userRoleExists: UserRoleExist[];
}

export interface UserRoleExist {
  id_role: number;
}
