import { Routes } from '@angular/router';
import { MainPageAdminLoginComponent } from './admin-login/main-page-admin-login/main-page-admin-login.component';
import { MainPageComponent } from './home/main-page/main-page.component';
import { MainPageLoginComponent } from './login/main-page-login/main-page-login.component';
import { PrincipalRegisterComponent } from './register/principal-register/principal-register.component';
import { MainPageRegisterApprenticeComponent } from './register/register-apprentice/main-page-register-apprentice/main-page-register-apprentice.component';
import { VerifyTokenComponent } from './shared/verify-token/verify-token.component';
import { MainPageTraceabilityComponent } from './traceability/main-page-traceability/main-page-traceability.component';
import { RecoverPasswordComponent } from './profiles/shared/recover-password/recover-password.component';
import { QRtestComponent } from './qr/qr.component';
/*import { WelcomeBusinessmanComponent } from './register/register-business/welcome-businessman/welcome-businessman.component';
import { WelcomeFarmerComponent } from './register/register-farmer/welcome-farmer/welcome-farmer.component';*/
import { PaymentConfirmationComponent } from './profiles/businessman/body-businessman/car-shop-business/payment-confirmation/payment-confirmation.component';

export const routes: Routes = [
  { path: 'admin-login', component: MainPageAdminLoginComponent },
  { path: 'QR', component: QRtestComponent },
  { path: 'home', component: MainPageComponent },
  {
    path: 'login',
    component: MainPageLoginComponent,
  },
  {
    path: 'register/profiles',
    component: PrincipalRegisterComponent,
  },
  /*
  {
    path: 'register/farmer',
    loadChildren: () =>
      import('./register/register-farmer/register-farmer.routes').then(
        (m) => m.routes
      ),
  },
  {
    path: 'welcome-farmer',
    component: WelcomeFarmerComponent,
  },*/
 /* {
    path: 'register/businessman',
    loadChildren: () =>
      import('./register/register-business/register-businessman.routes').then(
        (m) => m.routes
      ),
  },
  {
    path: 'welcome-businessman',
    component: WelcomeBusinessmanComponent,
  },*/
  {
    path: 'register/apprentice',
    component: MainPageRegisterApprenticeComponent,
  },
  {
    path: 'verify_token/:token',
    component: VerifyTokenComponent,
  },
  {
    path: 'user-farmer',
    loadChildren: () =>
      import('./profiles/farmer/user-farmer.routes').then((m) => m.routes),
  },
  {
    path: 'user-businessman',
    loadChildren: () =>
      import('./profiles/businessman/user-businessman.routes').then(
        (m) => m.routes
      ),
  },
  {
    path: 'user-apprentice',
    loadChildren: () =>
      import('./profiles/apprentice/apprentice.routes').then((m) => m.routes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.routes),
  },
  {
    path: 'payment/:id',
    component: PaymentConfirmationComponent,
  },
  {
    path: 'traceability/:id',
    component: MainPageTraceabilityComponent,
  },
  {
    path: 'recovery_password/:token',
    component: RecoverPasswordComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
