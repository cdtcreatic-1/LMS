import { Routes, RouterModule } from '@angular/router';
import { MainPageForm3BusinessComponent } from './main-page-form3-business/main-page-form3-business.component';
import { Form3aBusinessComponent } from './form3a-business/form3a-business.component';
import { Form3bBusinessComponent } from './form3b-business/form3b-business.component';
import { Form3cBusinessComponent } from './form3c-business/form3c-business.component';
import { Form3dBusinessComponent } from './form3d-business/form3d-business.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageForm3BusinessComponent,
    children: [
      {
        path: '1',
        component: Form3aBusinessComponent,
      },
      {
        path: '2',
        component: Form3bBusinessComponent,
      },
      {
        path: '3',
        component: Form3cBusinessComponent,
      },
      {
        path: '4',
        component: Form3dBusinessComponent,
      },
    ],
  },
];
