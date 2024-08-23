import { Routes } from '@angular/router';
import { AddObjetivesComponent } from './add-objetives/add-objetives.component';
import { AddModulesComponent } from './add-modules/add-modules.component';
import { AddModuleDetailsComponent } from './add-module-details/add-module-details.component';
import { AddSubmodulesComponent } from './add-submodules/add-submodules.component';
import { MainPAgeAddCoursesComponent } from './main-page-add-courses/main-page-add-courses';
import { AddCourseComponent } from './add-courses/add-course.component';
import { AddSubmoduleDetailsComponent } from './add-submodule-details/add-submodule-details.component';
import { AddEvaluationDetailsComponent } from './add-evaluation-details/add-evaluation-details.component';

export const routes: Routes = [
  {
    path: 'add/:action/:courseitem',
    component: MainPAgeAddCoursesComponent,
    children: [
      {
        path: 'add-course',
        component: AddCourseComponent,
      },
      {
        path: 'add-objetives',
        component: AddObjetivesComponent,
      },
      {
        path: 'add-modules',
        component: AddModulesComponent,
      },
      {
        path: 'add-module-details/:idmodule',
        component: AddModuleDetailsComponent,
      },
      {
        path: 'add-submodules/:idmodule',
        component: AddSubmodulesComponent,
      },
      {
        path: 'add-submodule-details/:idmodule/:idsubmodule',
        component: AddSubmoduleDetailsComponent,
      },
      {
        path: 'add-evaluation-details/:idmodule/:idsubmodule',
        component: AddEvaluationDetailsComponent,
      },
    ],
  },
];
