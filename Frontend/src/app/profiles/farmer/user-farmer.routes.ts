import { Routes } from '@angular/router';
import { MainPageFarmerComponent } from './main-page-farmer/main-page-farmer.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MainPageFarmerComponent,
      },
      {
        path: '**',
        redirectTo: 'user-farmer',
      },
    ],
  },
];
