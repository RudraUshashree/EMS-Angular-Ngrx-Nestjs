import { createReducer, on } from '@ngrx/store';
import { IDailyUpdate, IDailyUpdatesResponse } from 'src/app/models/daily-updates.model';
import { addDailyUpdate, addDailyUpdateError, addDailyUpdateSuccess, getDailyUpdates, getDailyUpdatesError, getDailyUpdatesSuccess, getEmployeeDailyUpdates, getEmployeeDailyUpdatesError, getEmployeeDailyUpdatesSuccess } from './actions';

export interface DailyUpdateState {
  loading: boolean;
  dailyUpdate: IDailyUpdate | null;
  dailyUpdates: IDailyUpdate[];
  error: any;
  addDailyUpdate: IDailyUpdatesResponse | null;
}

export const initialState: DailyUpdateState = {
  loading: false,
  dailyUpdate: null,
  dailyUpdates: [],
  error: null,
  addDailyUpdate: null,
};

export const dailyUpdateReducer = createReducer(
  initialState,

  // Add Project
  on(addDailyUpdate, (state): DailyUpdateState => ({ ...state, loading: true })),
  on(addDailyUpdateSuccess, (state, { res }): DailyUpdateState => {
    return { ...state, loading: false, addDailyUpdate: res, dailyUpdates: [res.dailyUpdate, ...(state.dailyUpdates ?? [])] };
  }),
  on(addDailyUpdateError, (state, { error }): DailyUpdateState => ({ ...state, loading: false, error })),

  // Get All Projects Leaves
  on(getDailyUpdates, (state): DailyUpdateState => ({ ...state, loading: true })),
  on(getDailyUpdatesSuccess, (state, { res }): DailyUpdateState => {
    return { ...state, loading: false, dailyUpdates: res }
  }),
  on(getDailyUpdatesError, (state, { error }): DailyUpdateState => ({ ...state, loading: false, error })),

  // Get Employee Projects Leaves
  on(getEmployeeDailyUpdates, (state): DailyUpdateState => ({ ...state, loading: true })),
  on(getEmployeeDailyUpdatesSuccess, (state, { res }): DailyUpdateState => ({ ...state, loading: false, dailyUpdates: res })),
  on(getEmployeeDailyUpdatesError, (state, { error }): DailyUpdateState => ({ ...state, loading: false, error })),

  // // Update Project
  // on(updateProject, (state): ProjectState => ({ ...state, loading: true })),
  // on(updateProjectSuccess, (state, { res }): ProjectState => {
  //   if (!state.projects) {
  //     return { ...state, loading: false };
  //   }

  //   const projectIndex = state.projects.findIndex(project => project._id === res.project._id);

  //   //   Check if the project exists in the current state
  //   if (projectIndex > -1) {
  //     const updatedProjects = [
  //       ...state.projects.slice(0, projectIndex),
  //       res.project,
  //       ...state.projects.slice(projectIndex + 1)
  //     ];
  //     return { ...state, loading: false, projects: updatedProjects };
  //   }

  //   // If project not found, return the state without modifications
  //   return { ...state, loading: false };
  // }),
  // on(updateProjectError, (state, { error }) => ({ ...state, loading: false, error })),
);
