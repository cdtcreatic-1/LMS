import { HttpHeaders } from '@angular/common/http';

export const ROUTES = {
  ADMIN_LOGIN: 'admin-login',
  AUTH: 'verify_token/:token',
  HOME: 'home',
  REGISTER: 'register',
  WELCOME_FARMER: 'welcome-farmer',
  WELCOME_BUSINESSMAN: 'welcome-businessman',
  REGISTER_BUSINESSMAN: {
    REGISTER_BUSINESSMAN: 'register/businessman',
    CHILDRENS: {
      PREFERENCES: 'preferences',
      FARM_HISTORY: 'farm-history',
    },
  },
  LOGIN: 'login',
  USER_FARMER: 'user-farmer',
  USER_BUSINESSMAN: 'user-businessman',
  USER_APPRENTICE: 'user-apprentice',
  ADMIN_PROFILE: 'admin/profile',
};

export const APIKEY_RECAPCHA: string =
  '6LdO0JwoAAAAALgpNqwhaTiFOKg58lkWLbJ6tggD';

// export const BASE_URL = 'http://localhost:3000/api/';
// export const BASE_URL_FRONTEND = 'http://localhost:4200/';

export const BASE_URL = 'http://93.188.162.233:3000/api/';
export const BASE_URL_FRONTEND = 'http://93.188.162.233:4200/';

// export const BASE_URL = 'https://dev.creatic-ip.com/api/';
// export const BASE_URL_FRONTEND = 'https://dev.creatic-ip.com/';

// export const BASE_URL = 'https://creatictrade.com/api/';
// export const BASE_URL_FRONTEND = 'https://creatictrade.com/';

const headers = new HttpHeaders({
  Accept: 'application/json',
  'Content-Type': 'application/json',
});
export const OPTIONS = { headers: headers };
