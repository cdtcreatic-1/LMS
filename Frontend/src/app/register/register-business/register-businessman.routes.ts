import { Routes } from '@angular/router';
import { MainPageRegisterBusinessComponent } from './main-page-register-business/main-page-register-business.component';
import { Form1BusinessComponent } from './form1-business/form1-business.component';
import { Form2BusinessComponent } from './form2-business/form2-business.component';
import { ROUTES } from 'src/app/shared/constants';
export const routes: Routes = [
  {
    path: '',
    component: MainPageRegisterBusinessComponent,
    children: [
      {
        path: '',
        component: Form1BusinessComponent,
      },
      {
        path: ROUTES.REGISTER_BUSINESSMAN.CHILDRENS.PREFERENCES,
        component: Form2BusinessComponent,
      },
      {
        path: ROUTES.REGISTER_BUSINESSMAN.CHILDRENS.FARM_HISTORY,
        loadChildren: () =>
          import('./form3-business/form3-businessman.route').then(
            (m) => m.routes
          ),
      },
      { path: '*', redirectTo: 'home' },
    ],
  },
];
