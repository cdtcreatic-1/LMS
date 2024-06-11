import { Routes } from '@angular/router';
import { MainPageProfileAdminComponent } from './profile/main-page-profile-admin/main-page-profile-admin.component';
import { AddDatesComponent } from './profile/body-admin/add-dates/add-dates.component';
import { AllUsersComponent } from './profile/body-admin/all-users/all-users.component';
import { AddContentComponent } from './profile/body-admin/add-content/add-content.component';
import { MainPageComponent } from '../home/main-page/main-page.component';
import { AllCoursesComponent } from './profile/body-admin/add-courses/all-courses/all-courses.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile',
        component: MainPageProfileAdminComponent,
        children: [
          {
            path: 'users',
            component: AllUsersComponent,
          },
          {
            path: 'add-content',
            component: AddContentComponent,
          },
          {
            path: 'add-dates',
            component: AddDatesComponent,
          },
          {
            path: 'all-courses',
            component: AllCoursesComponent,
          },
          {
            path: 'add-courses',
            loadChildren: () =>
              import(
                '../admin/profile/body-admin/add-courses/add-courses.routes'
              ).then((m) => m.routes),
          },
          {
            path: '**',
            component: AllUsersComponent,
          },
        ],
      },
      {
        path: '**',
        component: MainPageComponent,
      },
    ],
  },
];
