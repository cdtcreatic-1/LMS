import { createReducer, on } from '@ngrx/store';
import { InitialStateApprentice } from '../model';
import {
  setAccordionApprentice,
  setAllCourses,
  setChangeActualIdApprentice,
  setChangeIdEvaluacionFlow,
  setCourseSelected,
  setCurrentIdTypeLearning,
  setDataCarShop,
  setDataChatBoot,
  setDataMiCourses,
  setItemSelectedQuestion,
  setModalUpdateProfile,
  setOpenModalTypeLearning,
  setStatusPaymentApprentice,
  setIdSubmoduleSelected,
  setChangeIdEvaluation,
  setActualIdSkills,
  setOpenModalSkills,
  setDataModules,
  setDataSubmoduleSelected,
  setDataAccordionModules,
  setDataSubmoduleSelectedById,
  setDataQuestionAnsers,
  setSaveAnswersSubmodule,
  setchangeIdQuestion,
  setResetAnswersSubmodule,
  setFilterCourses,
  setFilterModulesSubmodules,
  setAccordionMyCourses,
  setShowModalMenuApprentice,
  setItemNavbarNotification,
  setRecommendedCourses,
} from '../actions/user-menu-apprentice.action';
import { dataQuestion } from 'src/app/profiles/apprentice/profile/body-apprentice/modals-type-learning/constants/contants';
import { itemNavbar, itemsNavBarNotification } from '../constants';
import {
  Module,
  ResponseGetAllInfoCourse,
  Submodules,
} from 'src/app/profiles/apprentice/course-evaluation/interfaces';
import { AllCourses } from 'src/app/profiles/apprentice/profile/interfaces';

export const initialStateDataFarmer: InitialStateApprentice = {
  actualId: 1,
  isAccordion: false,
  isAccordionMyCourses: false,
  isEditProfile: false,
  dataAllCoursesRef: [],
  dataAllCourses: [],
  myCourses: [],
  dataRecommendedCourses: [],
  idCourse: NaN,
  idSubmoduleSelected: NaN,
  dataCourseSelected: undefined,
  showModalTypeLearning: false,
  actualIdTypeLearning: 1,
  dataQuestion: dataQuestion,
  dataCartShop: [],
  idStatusPayment: NaN,
  dataChatBoot: [],
  itemsNavBarEvaluation: itemNavbar,
  showModalSkills: false,
  actualIdSkills: 1,
  itemsNavbarNotification: itemsNavBarNotification,
  idNavbarNotification: 1,
  // Flow course evaluation
  isModalMenuApprentice: false,
  dataModules: undefined,
  dataSubmodules: [],
  dataSubmoduleSelected: undefined,
  idEvaluation: 1,
  // Question Answers
  dataQuestionAnswers: undefined,
  dataAllAnswers: [],
  idSendEvaluation: 1,
};

export const apprendiceProfileReducer = createReducer(
  initialStateDataFarmer,
  on(setChangeActualIdApprentice, (state, { value }) => {
    return {
      ...state,
      actualId: value,
    };
  }),
  on(setAccordionApprentice, (state, { value }) => {
    return {
      ...state,
      isAccordion: value !== undefined ? value : !state.isAccordion,
    };
  }),
  on(setAccordionMyCourses, (state, { value }) => {
    return {
      ...state,
      isAccordionMyCourses:
        value !== undefined ? value : !state.isAccordionMyCourses,
    };
  }),
  on(setModalUpdateProfile, (state, { value }) => {
    return {
      ...state,
      isEditProfile: value,
    };
  }),
  on(setAllCourses, (state, { data }) => {
    return {
      ...state,
      dataAllCoursesRef: data,
      dataAllCourses: data,
    };
  }),
  on(setFilterCourses, (state, { courseName }) => {
    const AllCourses = [...state.dataAllCoursesRef];

    const newAllCurses: AllCourses[] = [];

    AllCourses.forEach((course) => {
      if (
        course.course_title.toLowerCase().includes(courseName.toLowerCase())
      ) {
        newAllCurses.push(course);
      }
    });

    return {
      ...state,
      dataAllCourses:
        courseName.length > 0 ? newAllCurses : state.dataAllCoursesRef,
    };
  }),

  on(setCourseSelected, (state, { data }) => {
    return {
      ...state,
      dataCourseSelected: data,
    };
  }),

  on(setOpenModalTypeLearning, (state, { value }) => {
    return {
      ...state,
      showModalTypeLearning: value,
    };
  }),
  on(setCurrentIdTypeLearning, (state, { value }) => {
    return {
      ...state,
      actualIdTypeLearning: value,
    };
  }),
  on(setItemSelectedQuestion, (state, { idQuestion, idAnswer }) => {
    let dataRefQuestion = [...state.dataQuestion];

    const newDataQuestion = dataRefQuestion[idQuestion - 1].answers.map(
      (answer) => {
        if (answer.id_answer === idAnswer) {
          return { ...answer, isSelected: true };
        } else {
          return { ...answer, isSelected: false };
        }
      }
    );

    const finallyData = dataRefQuestion.map((item, index) => {
      if (item.id_question === idQuestion) {
        return { ...item, answers: newDataQuestion };
      } else {
        return {
          ...item,
        };
      }
    });

    return {
      ...state,
      dataQuestion: finallyData,
    };
  }),
  on(setDataCarShop, (state, { data }) => {
    return {
      ...state,
      dataCartShop: data,
    };
  }),
  on(setStatusPaymentApprentice, (state, { value }) => {
    return {
      ...state,
      idStatusPayment: value,
    };
  }),
  on(setDataMiCourses, (state, { data }) => {
    return {
      ...state,
      myCourses: data,
    };
  }),
  on(setDataChatBoot, (state, { data }) => {
    const newData = [...state.dataChatBoot];
    newData.push(data);

    return {
      ...state,
      dataChatBoot: newData,
    };
  }),
  on(setIdSubmoduleSelected, (state, { id, id_course }) => {
    return {
      ...state,
      idCourse: id_course,
      idSubmoduleSelected: id,
    };
  }),
  on(setChangeIdEvaluacionFlow, (state, { id }) => {
    const newItemNavBar = state.itemsNavBarEvaluation.map((item) => {
      if (item.id === id) {
        return { ...item, isSelected: true };
      }
      return { ...item, isSelected: false };
    });

    return {
      ...state,
      itemsNavBarEvaluation: newItemNavBar,
    };
  }),
  on(setChangeIdEvaluation, (state, { value }) => {
    return {
      ...state,
      idEvaluation: value,
    };
  }),
  on(setOpenModalSkills, (state, { value }) => {
    return {
      ...state,
      showModalSkills: value,
    };
  }),

  on(setActualIdSkills, (state, { id }) => {
    return {
      ...state,
      actualIdSkills: id,
    };
  }),

  on(setItemNavbarNotification, (state, { id }) => {
    const newItemNavBar = state.itemsNavbarNotification.map((item) => {
      if (item.id === id) {
        return { ...item, isSelected: true };
      }
      return { ...item, isSelected: false };
    });

    return {
      ...state,
      itemsNavbarNotification: newItemNavBar,
      idNavbarNotification: id,
    };
  }),
  on(setRecommendedCourses, (state, { data }) => {
    return {
      ...state,
      dataRecommendedCourses: data,
    };
  }),

  // This flow view course

  on(setShowModalMenuApprentice, (state, { value }) => {
    return {
      ...state,
      isModalMenuApprentice: value,
    };
  }),

  on(setFilterModulesSubmodules, (state, { valueForm }) => {
    if (!state.dataModules) {
      return {
        ...state,
      };
    }

    const allModules: ResponseGetAllInfoCourse = { ...state.dataModules };
    const newAllModule: Module[] = [];

    allModules.Modules.forEach((itemModule) => {
      if (
        itemModule.module_title.toLowerCase().includes(valueForm.toLowerCase())
      ) {
        newAllModule.push(itemModule);
      }
    });

    const newData: ResponseGetAllInfoCourse = {
      ...allModules,
      Modules: newAllModule,
    };

    return {
      ...state,
      dataModules: valueForm.length > 0 ? newData : state.dataModulesRef,
    };
  }),

  on(setDataModules, (state, { data }) => {
    let newDataModules = { ...data };

    const newModules: Module[] = [];
    const newSubModules: Submodules[] = [];

    data.Modules.forEach((moduleItem, indexModule) => {
      let isSubmodule: boolean = false;
      const newSubmodule = moduleItem.Submodules.map((submodule) => {
        newSubModules.push(submodule);

        if (submodule.id_submodule === state.idSubmoduleSelected) {
          isSubmodule = true;
        }
        return {
          ...submodule,
          isSelected:
            submodule.id_submodule === state.idSubmoduleSelected ? true : false,
        };
      });

      newModules.push({
        ...moduleItem,
        Submodules: newSubmodule,
        isSelected: isSubmodule,
      });
    });

    newDataModules.Modules = newModules;

    return {
      ...state,
      dataModules: newDataModules,
      dataModulesRef: newDataModules,
      dataSubmodules: newSubModules,
    };
  }),
  on(setDataSubmoduleSelected, (state, { data }) => {
    const submoduleSelected = { ...data };
    let newDataModules: ResponseGetAllInfoCourse = { ...state.dataModules! };

    const newModules: Module[] = [];

    let idModuleSelected: number = NaN;
    newDataModules.Modules!.forEach((moduleItem) => {
      const newSubmodule = moduleItem.Submodules.map((submodule) => {
        if (submodule.id_submodule === submoduleSelected.id_submodule) {
          idModuleSelected = moduleItem.id_module;
          return { ...submodule, isSelected: true };
        }
        return { ...submodule, isSelected: false };
      });

      newModules.push({
        ...moduleItem,

        Submodules: newSubmodule,
      });
    });

    newDataModules.Modules = newModules.map((item) => {
      if (item.id_module === idModuleSelected) {
        return { ...item, isSelected: true };
      }
      return { ...item, isSelected: false };
    });

    return {
      ...state,
      idSubmoduleSelected: data.id_submodule,
      dataSubmoduleSelected: data,
      dataModules: { ...newDataModules },
    };
  }),
  on(setDataSubmoduleSelectedById, (state, { id }) => {
    let newDataSubmoduleSelected: Submodules | undefined;

    state.dataModules?.Modules.forEach((itemModule) => {
      itemModule.Submodules.forEach((submodule) => {
        if (submodule.id_submodule === id) {
          newDataSubmoduleSelected = submodule;
        }
      });
    });

    return {
      ...state,
      dataSubmoduleSelected: newDataSubmoduleSelected,
    };
  }),

  on(setDataAccordionModules, (state, { id }) => {
    let newAllDataModules: ResponseGetAllInfoCourse = { ...state.dataModules! };

    const newDataModules = state.dataModules?.Modules.map((moduleItem) => {
      if (moduleItem.id_module === id) {
        return {
          ...moduleItem,
          isAccordion: !moduleItem.isAccordion,
        };
      }
      return { ...moduleItem };
    });

    newAllDataModules.Modules = newDataModules!;

    return {
      ...state,
      dataModules: newAllDataModules,
    };
  }),

  // Data Question Answers

  on(setDataQuestionAnsers, (state, { data }) => {
    return {
      ...state,
      dataQuestionAnswers: data,
    };
  }),
  on(setSaveAnswersSubmodule, (state, { data }) => {
    let newDataAllAnswers = [...state.dataAllAnswers];

    data.forEach((itemData) => {
      let indexData: number = NaN;
      const findQuestion = newDataAllAnswers.find((item, index) => {
        if (item[0].id_question === itemData.id_question) {
          indexData = index;
          return { ...item };
        }

        return null;
      });

      if (findQuestion) {
        newDataAllAnswers[indexData] = data;
      } else {
        newDataAllAnswers.push(data);
      }
    });

    return {
      ...state,
      dataAllAnswers: newDataAllAnswers,
    };
  }),
  on(setResetAnswersSubmodule, (state) => {
    return {
      ...state,
      dataAllAnswers: [],
    };
  }),
  on(setchangeIdQuestion, (state, { id }) => {
    return {
      ...state,
      idSendEvaluation: id,
    };
  })
);
