import { createSelector } from '@ngrx/store';
import { AppState } from '../reducer';
import { DailyUpdateState } from './reducer';

export const selectDailyUpdateFeature = (state: AppState) => state.dailyUpdate;

export const selectDailyUpdatesLoading = createSelector(
  selectDailyUpdateFeature,
  (state: DailyUpdateState) => state.loading
);

export const selectAddDailyUpdate = createSelector(
  selectDailyUpdateFeature,
  (state: DailyUpdateState) => state.addDailyUpdate
);

export const selectDailyUpdates = createSelector(
  selectDailyUpdateFeature,
  (state: DailyUpdateState) => state.dailyUpdates
);
