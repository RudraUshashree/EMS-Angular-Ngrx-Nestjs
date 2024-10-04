import { createSelector } from '@ngrx/store';
import { AppState } from '../reducer';
import { EmployeesState } from './reducer';

export const selectGetEmployeesFeature = (state: AppState) => state.employee;

export const selectGetEmployeesLoading = createSelector(
  selectGetEmployeesFeature,
  (state: EmployeesState) => state.loading
);

export const selectGetEmployees = createSelector(
  selectGetEmployeesFeature,
  (state: EmployeesState) => (state.employees ?? [])
);

export const selectGetOneEmployee = createSelector(
  selectGetEmployeesFeature,
  (state: EmployeesState) => state.employee
);

export const selectUpdateEmployee = createSelector(
  selectGetEmployeesFeature,
  (state: EmployeesState) => state.updatedemployee
);
