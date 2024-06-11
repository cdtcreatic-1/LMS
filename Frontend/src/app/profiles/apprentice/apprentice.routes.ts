import { Routes } from '@angular/router';
import { MainPageApprenticeComponent } from './profile/main-page-apprentice/main-page-apprentice.component';
import { MainPageCourseEvaluationComponent } from './course-evaluation/main-page-course-evaluation/main-page-course-evaluation.component';
import { CapacitationVideoComponent } from './course-evaluation/body/capacitation-video/capacitation-video.component';
import { MainPageEvaluationComponent } from './course-evaluation/body/evaluation/main-page-evaluation/main-page-evaluation.component';
import { MainPageResultsComponent } from './course-evaluation/body/results/main-page-results/main-page-results.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MainPageApprenticeComponent,
      },
      {
        path: 'course-evaluation/:idCourse',
        component: MainPageCourseEvaluationComponent,
        children: [
          {
            path: 'training-video/:idSubmodule',
            component: CapacitationVideoComponent,
          },
          {
            path: 'evaluation/:idSubmodule',
            component: MainPageEvaluationComponent,
          },
          {
            path: 'results/:idSubmodule',
            component: MainPageResultsComponent,
          },
        ],
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
