import { createReducer, on } from '@ngrx/store';
import { IDailyUpdate, IDailyUpdatesResponse } from 'src/app/models/daily-updates.model';
import {
  addDailyUpdate,
  addDailyUpdateError,
  addDailyUpdateSuccess,
  getDailyUpdates,
  getDailyUpdatesError,
  getDailyUpdatesSuccess,
  getEmployeeDailyUpdates,
  getEmployeeDailyUpdatesError,
  getEmployeeDailyUpdatesSuccess,
  updateDailyUpdate,
  updateDailyUpdateError,
  updateDailyUpdateSuccess
} from './actions';

export interface DailyUpdateState {
  loading: boolean;
  dailyUpdate: IDailyUpdate | null;
  dailyUpdates: IDailyUpdate[];
  dailyUpdateResponse: IDailyUpdatesResponse | null;
  error: any;
}

export const initialState: DailyUpdateState = {
  loading: false,
  dailyUpdate: null,
  dailyUpdates: [],
  dailyUpdateResponse: null,
  error: null,
};

export const dailyUpdateReducer = createReducer(
  initialState,

  // Add Daily Update
  on(addDailyUpdate, (state): DailyUpdateState => ({ ...state, loading: true })),
  on(addDailyUpdateSuccess, (state, { res }): DailyUpdateState => {
    return { ...state, loading: false, dailyUpdateResponse: res, dailyUpdates: [res.dailyUpdate, ...(state.dailyUpdates ?? [])] };
  }),
  on(addDailyUpdateError, (state, { error }): DailyUpdateState => ({ ...state, loading: false, error })),

  // Get All Daily Updates
  on(getDailyUpdates, (state): DailyUpdateState => ({ ...state, loading: true })),
  on(getDailyUpdatesSuccess, (state, { res }): DailyUpdateState => {
    return { ...state, loading: false, dailyUpdates: res }
  }),
  on(getDailyUpdatesError, (state, { error }): DailyUpdateState => ({ ...state, loading: false, error })),

  // Get Employee Daily Updates
  on(getEmployeeDailyUpdates, (state): DailyUpdateState => ({ ...state, loading: true })),
  on(getEmployeeDailyUpdatesSuccess, (state, { res }): DailyUpdateState => ({ ...state, loading: false, dailyUpdates: res })),
  on(getEmployeeDailyUpdatesError, (state, { error }): DailyUpdateState => ({ ...state, loading: false, error })),

  // Update Daily Update
  on(updateDailyUpdate, (state): DailyUpdateState => ({ ...state, loading: true })),
  on(updateDailyUpdateSuccess, (state, { res }): DailyUpdateState => {
    if (!state.dailyUpdates) {
      return { ...state, loading: false };
    }

    const dailyUpdateIndex = state.dailyUpdates.findIndex(dailyUpdate => dailyUpdate._id === res.dailyUpdate._id);

    //   Check if the daily update exists in the current state
    if (dailyUpdateIndex > -1) {
      const updatedDailyUpdates = [
        ...state.dailyUpdates.slice(0, dailyUpdateIndex),
        res.dailyUpdate,
        ...state.dailyUpdates.slice(dailyUpdateIndex + 1)
      ];
      return { ...state, loading: false, dailyUpdates: updatedDailyUpdates };
    }

    // If daily update not found, return the state without modifications
    return { ...state, loading: false };
  }),
  on(updateDailyUpdateError, (state, { error }) => ({ ...state, loading: false, error })),
);
