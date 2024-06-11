import { createAction, props } from '@ngrx/store';
import { ResponseAllCourses } from 'src/app/admin/profile/body-admin/add-courses/interfaces';

export const setAllCourses = createAction(
  '[Data SetAllCourses] setAllCourses',
  props<{ data: ResponseAllCourses[] }>()
);

export const setCourseSelected = createAction(
  '[Data SetCourseSelected] setCourseSelected',
  props<{ idCourse: number }>()
);

export const setIdActionCourse = createAction(
  '[Data SetIdAction] setIdAction',
  props<{ idAction: number; idCourse: number }>()
);
