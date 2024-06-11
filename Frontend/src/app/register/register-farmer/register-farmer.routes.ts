import { Routes } from '@angular/router';
import { MainPageRegisterComponent } from './main-page-register/main-page-register.component';
import { FormRegisterFarmerComponent } from './form-register-farmer/form-register-farmer.component';
import { FormMapFarmerComponent } from './form-map-farmer/form-map-farmer.component';
import { FormReviewComponent } from './form-review/form-review.component';
import { FormUserCreatedComponent } from './form-user-created/form-user-created.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageRegisterComponent,
    children: [
      {
        path: '',
        component: FormRegisterFarmerComponent,
      },
      {
        path: 'locate-farm',
        component: FormMapFarmerComponent,
      },
      {
        path: 'history-farmer',
        component: FormReviewComponent,
      },
      {
        path: 'user-created',
        component: FormUserCreatedComponent,
      },
      { path: '*', redirectTo: 'home' },
    ],
  },
];
