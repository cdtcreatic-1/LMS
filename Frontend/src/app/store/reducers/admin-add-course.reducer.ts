import { createReducer, on } from '@ngrx/store';
import { InitialStateAdminAddCourses } from '../model';
import {
  setAllCourses,
  setCourseSelected,
  setIdActionCourse,
} from '../actions/admin-add-course.actions';

export const initialStateAdminAddCourses: InitialStateAdminAddCourses = {
  allCourses: [],
  courseSelected: undefined,
  idAction: 1,
  idCourseSelected: NaN,
};

export const adminAddCourseReducer = createReducer(
  initialStateAdminAddCourses,
  on(setAllCourses, (state, { data }) => {
    return {
      ...state,
      allCourses: data,
    };
  }),
  on(setCourseSelected, (state, { idCourse }) => {
    const resFindCourse = state.allCourses.find(
      (item) => item.id_course === idCourse
    );

    return {
      ...state,
      courseSelected: resFindCourse,
    };
  }),
  on(setIdActionCourse, (state, { idAction, idCourse }) => {
    return {
      ...state,
      idAction,
      idCourseSelected: idCourse,
    };
  })
);
