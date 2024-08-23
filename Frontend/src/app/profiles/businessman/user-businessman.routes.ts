import { Routes } from '@angular/router';
import { MainPageBusinessComponent } from 'src/app/profiles/businessman/main-page-profile-business/main-page-profile-business.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MainPageBusinessComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
