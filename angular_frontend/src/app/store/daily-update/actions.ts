import { createAction, props } from '@ngrx/store';
import { IAddDailyUpdatePayload, IDailyUpdate, IDailyUpdatesResponse, IUpdateDailyUpdatePayload } from 'src/app/models/daily-updates.model';

// Add Daily Update
export const addDailyUpdate = createAction(
  '[DailyUpdate] Add DailyUpdate',
  props<{ payload: IAddDailyUpdatePayload }>()
);
export const addDailyUpdateSuccess = createAction(
  '[DailyUpdate] AddDailyUpdateSuccess',
  props<{ res: IDailyUpdatesResponse }>()
);
export const addDailyUpdateError = createAction(
  '[DailyUpdate] AddDailyUpdateError',
  props<{ error: any }>()
);


// Get All Daily Updates
export const getDailyUpdates = createAction(
  '[DailyUpdates] GetDailyUpdates'
);

export const getDailyUpdatesSuccess = createAction(
  '[DailyUpdates] GetDailyUpdatesSuccess',
  props<{ res: IDailyUpdate[] }>()
);

export const getDailyUpdatesError = createAction(
  '[DailyUpdates] GetDailyUpdatesError',
  props<{ error: any }>()
);

// Get Employee Daily Updates
export const getEmployeeDailyUpdates = createAction(
  '[DailyUpdates] GetEmployeeDailyUpdates',
  props<{ empId: string }>()
);

export const getEmployeeDailyUpdatesSuccess = createAction(
  '[DailyUpdates] GetEmployeeDailyUpdatesSuccess',
  props<{ res: IDailyUpdate[] }>()
);

export const getEmployeeDailyUpdatesError = createAction(
  '[DailyUpdates] GetEmployeeDailyUpdatesError',
  props<{ error: any }>()
);


// Update Daily Updates
export const updateDailyUpdate = createAction(
  '[DailyUpdate] UpdateDailyUpdate',
  props<{ id: string, payload: IUpdateDailyUpdatePayload }>()
);

export const updateDailyUpdateSuccess = createAction(
  '[DailyUpdate] UpdateDailyUpdateSuccess',
  props<{ res: IDailyUpdatesResponse }>()
);

export const updateDailyUpdateError = createAction(
  '[DailyUpdate] UpdateDailyUpdateError',
  props<{ error: any }>()
);
