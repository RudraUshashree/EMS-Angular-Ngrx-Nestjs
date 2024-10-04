import { createSelector } from '@ngrx/store';
import { AppState } from '../reducer';
import { LeaveState } from './reducer';

export const selectLeaveFeature = (state: AppState) => state.leave;

export const selectLeaveLoading = createSelector(
  selectLeaveFeature,
  (state: LeaveState) => state.loading
);

export const selectAddLeave = createSelector(
  selectLeaveFeature,
  (state: LeaveState) => state.addLeave
);

export const selectEmployeeLeaves = createSelector(
  selectLeaveFeature,
  (state: LeaveState) => state.leaves
);

export const selectDeleteEmployeeLeave = createSelector(
  selectLeaveFeature,
  (state: LeaveState) => state.leaves
);

export const selectUpdateEmployeeLeaveStatus = createSelector(
  selectLeaveFeature,
  (state: LeaveState) => state.updatedleave
);
