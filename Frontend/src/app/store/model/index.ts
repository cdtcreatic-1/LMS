import { DataStepsApprentice } from 'src/app/profiles/apprentice/profile/body-apprentice/modals-type-learning/interfaces';
import {
  AllCourses,
  CartCourse,
  DataChatBoot,
  ItemsNavBar,
  ItemsNavBarNotification,
  MyCourseInfo,
  Submodule,
} from 'src/app/profiles/apprentice/profile/interfaces';
import { DataCurrentWindow } from 'src/app/register/interfaces';
import {
  CoffeeVariety,
  DataProfileCoffe,
  DataRegister,
  DataUserFarmer,
  ResponseRegisterBusineeman,
  ResponseRegisterFarmer,
  States,
} from 'src/app/register/register-farmer/interface';
import {
  DataTrendFarmers,
  DataTrends,
  DataUserRegister,
  UserRoleExist,
} from 'src/app/shared/interfaces';
import {
  DataCarShop,
  DataFarmerSelected,
  DataLots,
  DataNotificationBusinessman,
  DataOffertLost,
  Farmers,
} from 'src/app/profiles/businessman/body-businessman/interfaces';
import {
  FormCertificates,
  FormPriceCoffee,
  FormReviewCoffee,
  FormTypeCoffee,
} from 'src/app/profiles/farmer/body-farmer/add-lots/interfaces';
import {
  DataProfileFarm,
  DataTableStateSell,
  LotSummary,
  Lots,
  ResponseDocumentFarmer,
  ResponseNotification,
  ResponseReconmendationPrice,
  ResponseTotalLots,
} from 'src/app/profiles/farmer/interfaces';
import {
  DataSearhProduct,
  ResponseDataSearchProducts,
} from 'src/app/profiles/businessman/interfaces';
import { ResponseAllCourses } from 'src/app/admin/profile/body-admin/add-courses/interfaces';
import {
  ResponseGetAllInfoCourse,
  ResponseGetAllQuestionsAnswers,
  SubmoduleAnswer,
  Submodules,
} from 'src/app/profiles/apprentice/course-evaluation/interfaces';

export interface InitialStateShared {
  dataUserRegister?: DataUserRegister;
  dataQr: string;
  dataRoles: UserRoleExist[];
  actualIdRole: number;
}

export interface FarmerProfile {
  dataUserFarmer?: DataUserFarmer;
  dataRegister?: DataRegister;
  dataFarm: DataProfileFarm[];
  dataCoffeeName?: DataProfileCoffe;
  dataLots: Lots[];
  dataDocuments?: ResponseDocumentFarmer;
  actualIdRegisterLots: number;
  actualId: number;
  newNameVillage: string;
  farmSelected?: DataProfileFarm;
  dataLotsByFarm: ResponseTotalLots[];
  dataPriceRecomendation?: ResponseReconmendationPrice;
  dataRegisterBusinessman?: ResponseRegisterBusineeman;
  dataRegisterFarmer?: ResponseRegisterFarmer;
  dataNotificationFarmer: ResponseNotification[];
  dataTableStateSell: DataTableStateSell[];
  dataTrends: DataTrends[];
  dataSampleLot?: DataLots;
  dataOffertLots: DataOffertLost[];
  idBuyerSelected: number;
  lotSelected?: LotSummary;
}

export interface InitialDatateCurrentWindow {
  dataCurrentWindow?: DataCurrentWindow;
  actualCurrentWindow?: number;
  actualCurrentWindowR?: number;
  emailVerified: string;
}

export interface InitialStateMenuBusinessman {
  pathDocument: string;
  dataFarmers: Farmers[];
  idFarmSelected: number;
  dataLots: DataLots[];
  dataFarmerSelected?: DataFarmerSelected;
  dataCarShop: DataCarShop[];
  totalPriceCarShop: number;
  dataNotification: DataNotificationBusinessman[];
  dataLotDescription?: DataNotificationBusinessman;
  dataTableBusinessman: DataTableStateSell[];
  dataTrends: DataTrendFarmers[];
  idStatusPayment: number;
  dataSearchProduct?: DataSearhProduct;
  dataReponseSearchProducts?: ResponseDataSearchProducts;
  showModalSearchPrice: boolean;
  dataCoffeeVariety: (CoffeeVariety & { isSelected: boolean })[];
  dataStates: (States & { isSelected: boolean })[];
  rangePrice?: {
    min: number;
    max: number;
  };
  minPrice: number;
  maxPrice: number;
}

export interface InitialStateErrorMessage {
  isError: boolean;
  message: string;
  good: boolean;
}

export interface InitialStateAddLots {
  profileTazaName: string;
  formTypeCoffee?: FormTypeCoffee;
  formPriceCoffee?: FormPriceCoffee;
  formReviewCoffee?: FormReviewCoffee;
  dataCertificates?: FormCertificates;
}

export interface InitialStateApprentice {
  actualId: number;
  isAccordion: boolean;
  isAccordionMyCourses: boolean;
  isEditProfile: boolean;
  dataAllCoursesRef: AllCourses[];
  dataAllCourses: AllCourses[];
  myCourses: MyCourseInfo[];
  dataRecommendedCourses: AllCourses[];
  idCourse: number;
  idSubmoduleSelected: number;
  dataCourseSelected?: AllCourses;
  showModalTypeLearning: boolean;
  actualIdTypeLearning: number;
  showModalSkills: boolean;
  actualIdSkills: number;
  dataQuestion: DataStepsApprentice[];
  dataCartShop: CartCourse[];
  idStatusPayment: number;
  dataChatBoot: DataChatBoot[];
  itemsNavbarNotification: ItemsNavBarNotification[];
  idNavbarNotification: number;
  // Values evaluation flow
  itemsNavBarEvaluation: ItemsNavBar[];
  // Evaluation
  isModalMenuApprentice: boolean;
  dataModulesRef?: ResponseGetAllInfoCourse;
  dataModules?: ResponseGetAllInfoCourse;
  dataSubmodules: Submodules[];
  dataSubmoduleSelected?: Submodule;
  idEvaluation: number;
  // Data Question Answers
  dataQuestionAnswers?: ResponseGetAllQuestionsAnswers;
  dataAllAnswers: Array<SubmoduleAnswer[]>;
  idSendEvaluation: number;
}

// Loading component

export interface InitialStateLoadinComponent {
  isLoading: boolean;
}

// Model Admin

export interface InitialStateAdmin {
  actualIdWindow: number;
}

export interface InitialStateAdminAddCourses {
  allCourses: ResponseAllCourses[];
  courseSelected?: ResponseAllCourses;
  idAction: number;
  idCourseSelected: number;
}
