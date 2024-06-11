import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
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
} from '../model';

const selectFarmer = (state: AppState) => state.FarmerProfile;

export const selectDataUser = createSelector(
  selectFarmer,
  (state: FarmerProfile) => state
);

const selectCurrentWindow = (state: AppState) => state.currentWindow;

export const selectDataCurrentWindow = createSelector(
  selectCurrentWindow,
  (state: InitialDatateCurrentWindow) => state
);

const selectCurrentWindowR = (state: AppState) => state.currentWindow;

export const selectDataCurrentWindowR = createSelector(
  selectCurrentWindowR,
  (state: InitialDatateCurrentWindow) => state
);

const selectShared = (state: AppState) => state.shared;

export const selectDataShared = createSelector(
  selectShared,
  (state: InitialStateShared) => state
);

const selectDataBusinessman = (state: AppState) => state.BusinessProfile;

export const selectBusinessProfile = createSelector(
  selectDataBusinessman,
  (state: InitialStateMenuBusinessman) => state
);

const selectDataErrorMessage = (state: AppState) => state.errorMessagee;

export const selectErrorMessage = createSelector(
  selectDataErrorMessage,
  (state: InitialStateErrorMessage) => state
);

const selectDataAddLots = (state: AppState) => state.addLotsFarmer;

export const selectAddLots = createSelector(
  selectDataAddLots,
  (state: InitialStateAddLots) => state
);

const selectApprenticeProfile = (state: AppState) => state.ApprenticeProfile;

export const selectApprentice = createSelector(
  selectApprenticeProfile,
  (state: InitialStateApprentice) => state
);

const selectAdminProfile = (state: AppState) => state.admin;

export const selectAdmin = createSelector(
  selectAdminProfile,
  (state: InitialStateAdmin) => state
);

// Admin add courses

const selectAdminAddCourse = (state: AppState) => state.adminAddCourse;

export const selectAdminAddCourses = createSelector(
  selectAdminAddCourse,
  (state: InitialStateAdminAddCourses) => state
);

// Loading

const selectLoadingComponent = (state: AppState) => state.loading;

export const selectLoading = createSelector(
  selectLoadingComponent,
  (state: InitialStateLoadinComponent) => state
);
