import { createAction, props } from '@ngrx/store';
import {
  ResponseGetAllInfoCourse,
  ResponseGetAllQuestionsAnswers,
  SubmoduleAnswer,
} from 'src/app/profiles/apprentice/course-evaluation/interfaces';
import {
  AllCourses,
  CartCourse,
  DataChatBoot,
  MyCourseInfo,
  Submodule,
} from 'src/app/profiles/apprentice/profile/interfaces';

export const setChangeActualIdApprentice = createAction(
  '[Data SetChangeActualIdApprentice] setChangeActualIdApprentice',
  props<{ value: number }>()
);

export const setAccordionApprentice = createAction(
  '[Data SetAccordionApprentice] setAccordionApprentice',
  props<{ value?: boolean }>()
);

export const setAccordionMyCourses = createAction(
  '[Data SetAccordionMyCourses] setAccordionMyCourses',
  props<{ value?: boolean }>()
);

export const setModalUpdateProfile = createAction(
  '[Data SetModalUpdateProfile] setModalUpdateProfile',
  props<{ value: boolean }>()
);

export const setAllCourses = createAction(
  '[Data setAllCourses] setAllCourses',
  props<{ data: AllCourses[] }>()
);

export const setCourseSelected = createAction(
  '[Data SetCourseSelected] setCourseSelected',
  props<{ data: AllCourses }>()
);

export const setOpenModalTypeLearning = createAction(
  '[Data SetOpenModalTypeLearning] setOpenModalTypeLearning',
  props<{ value: boolean }>()
);

export const setCurrentIdTypeLearning = createAction(
  '[Data SetCurrentIdTypeLearning] setCurrentIdTypeLearning',
  props<{ value: number }>()
);

export const setItemSelectedQuestion = createAction(
  '[Data SetItemSelectedQuestion] setItemSelectedQuestion',
  props<{ idQuestion: number; idAnswer: number }>()
);

// CarShop

export const setDataCarShop = createAction(
  '[Data SetDataCarShop] setDataCarShop',
  props<{ data: CartCourse[] }>()
);

// My courses

export const setDataMiCourses = createAction(
  '[Data SetDataMiCourses] setDataMiCourses',
  props<{ data: MyCourseInfo[] }>()
);

export const setIdSubmoduleSelected = createAction(
  '[Data SetMyCourseSelected] setMyCourseSelected',
  props<{ id: number; id_course: number }>()
);

// Payment

export const setStatusPaymentApprentice = createAction(
  '[Data SetStatusPaymentApprentice] setStatusPaymentApprentice',
  props<{ value: number }>()
);

// Chat boot

export const setDataChatBoot = createAction(
  '[Data SetDataChatBoot] setDataChatBoot',
  props<{ data: DataChatBoot }>()
);

// Skills

export const setOpenModalSkills = createAction(
  '[Data SetOpenModalSkills] setOpenModalSkills',
  props<{ value: boolean }>()
);

export const setActualIdSkills = createAction(
  '[Data SetActualIdSkills] setActualIdSkills',
  props<{ id: number }>()
);

// Filter course profile

export const setFilterCourses = createAction(
  '[Data SetFilterCourses] setFilterCourses',
  props<{ courseName: string }>()
);

// Course Recommended

export const setRecommendedCourses = createAction(
  '[Data SetRecommendedCourses] setRecommendedCourses',
  props<{ data: AllCourses[] }>()
);


// Notification Apprentice

export const setItemNavbarNotification = createAction(
  '[Data SetItemNavbarNotification] setItemNavbarNotification',
  props<{ id: number }>()
);

// Evaluation flow

// Data Modules and submodules

export const setFilterModulesSubmodules = createAction(
  '[Data SetFilterModulesSubmodules] setFilterModulesSubmodules',
  props<{ valueForm: string }>()
);

export const setShowModalMenuApprentice = createAction(
  '[Data SetShowModalMenuApprentice] setShowModalMenuApprentice',
  props<{ value: boolean }>()
);

export const setDataModules = createAction(
  '[Data SetDataModules] setDataModules',
  props<{ data: ResponseGetAllInfoCourse }>()
);

export const setDataSubmoduleSelected = createAction(
  '[Data SetDataSubmoduleSelected] setDataSubmoduleSelected',
  props<{ data: Submodule }>()
);

export const setDataSubmoduleSelectedById = createAction(
  '[Data SetDataSubmoduleSelectedById] setDataSubmoduleSelectedById',
  props<{ id: number }>()
);

export const setDataAccordionModules = createAction(
  '[Data SetDataAccordionModules] setDataAccordionModules',
  props<{ id: number }>()
);

export const setChangeIdEvaluacionFlow = createAction(
  '[Data setChangeIdEvaluacionFlow] setChangeIdEvaluacionFlow',
  props<{ id: number }>()
);

export const setChangeIdEvaluation = createAction(
  '[Data SetChangeIdEvaluation] setChangeIdEvaluation',
  props<{ value: number }>()
);

// data question and answers

export const setDataQuestionAnsers = createAction(
  '[Data setDataQuestionAnsers] setDataQuestionAnsers',
  props<{ data: ResponseGetAllQuestionsAnswers }>()
);

export const setSaveAnswersSubmodule = createAction(
  '[Data SetSaveAnswersSubmodule] setSaveAnswersSubmodule',
  props<{ data: SubmoduleAnswer[] }>()
);

export const setResetAnswersSubmodule = createAction(
  '[Data SetResetAnswersSubmodule] setResetAnswersSubmodule'
);

// Id evaluacion change screen question to send question

export const setchangeIdQuestion = createAction(
  '[Data setchangeIdQuestion] setchangeIdQuestion',
  props<{ id: number }>()
);
