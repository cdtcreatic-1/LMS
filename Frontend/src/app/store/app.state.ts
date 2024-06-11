import { ActionReducerMap } from '@ngrx/store';
import {
  FarmerProfile,
  InitialDatateCurrentWindow,
  InitialStateAddLots,
  InitialStateAdmin,
  InitialStateAdminAddCourses,
  InitialStateApprentice,
  InitialStateErrorMessage,
  InitialStateLoadinComponent,
  InitialStateMenuBusinessman,
  InitialStateShared,
} from './model';
import { dataFarmerProfile } from './reducers/user-menu.reducer';
import { currentWindowReducers } from './reducers/corrent-window.reducer';
import { ProfileBusinessman } from './reducers/user-menu-business.reducer';
import { errorMessageRecuder } from './reducers/error-message.reducer';
import { addLotsReducers } from './reducers/add-lots.reducer';
import { apprendiceProfileReducer } from './reducers/user-menu-apprentice.reducer';
import { sharedReducer } from './reducers/shared.reducer';
import { adminReducer } from './reducers/admin.reducer';
import { adminAddCourseReducer } from './reducers/admin-add-course.reducer';
import { loadingReducer } from './reducers/loading.reducer';

export interface AppState {
  errorMessagee: InitialStateErrorMessage;
  loading: InitialStateLoadinComponent;
  currentWindow: InitialDatateCurrentWindow;
  FarmerProfile: FarmerProfile;
  BusinessProfile: InitialStateMenuBusinessman;
  addLotsFarmer: InitialStateAddLots;
  ApprenticeProfile: InitialStateApprentice;
  shared: InitialStateShared;
  admin: InitialStateAdmin;
  adminAddCourse: InitialStateAdminAddCourses;
}

export const ROOT_REDUCER: ActionReducerMap<AppState> = {
  errorMessagee: errorMessageRecuder,
  loading: loadingReducer,
  currentWindow: currentWindowReducers,
  FarmerProfile: dataFarmerProfile,
  addLotsFarmer: addLotsReducers,
  BusinessProfile: ProfileBusinessman,
  ApprenticeProfile: apprendiceProfileReducer,
  shared: sharedReducer,
  admin: adminReducer,
  adminAddCourse: adminAddCourseReducer,
};
