export interface LoginRequest {
  email: string;
  password: string;
}

export interface initialStateLogin {
  rolId?: number;
  userId?: number;
  isErrorLogin: boolean;
  code: string;
  currentWindow?: number;
}