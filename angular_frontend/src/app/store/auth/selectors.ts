import { createSelector } from '@ngrx/store';
import { AuthState } from './reducer';
import { AppState } from '../reducer';

export const selectAuthFeature = (state: AppState) => state.auth;

export const selectAuthLoading = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.loading
);

export const selectAuthUser = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.user
);

export const selectAuthSignupSuccess = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.signupSuccess
);

export const selectAuthError = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.error
);
