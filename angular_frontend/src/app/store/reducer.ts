import { ActionReducerMap } from "@ngrx/store";
import { authReducer, AuthState } from "./auth/reducer";
import { employeeReducer, EmployeesState } from "./employee/reducer";
import { leaveReducer, LeaveState } from "./leaves/reducer";
import { projectReducer, ProjectState } from "./project/reducer";

export interface AppState {
  auth: AuthState;
  employee: EmployeesState,
  leave: LeaveState,
  project: ProjectState
}

export const store: ActionReducerMap<AppState> = {
  auth: authReducer,
  employee: employeeReducer,
  leave: leaveReducer,
  project: projectReducer
};
