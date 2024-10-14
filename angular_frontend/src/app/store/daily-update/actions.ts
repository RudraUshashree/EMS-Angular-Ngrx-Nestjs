import { createAction, props } from '@ngrx/store';
import { IAddDailyUpdatePayload, IDailyUpdate, IDailyUpdatesResponse } from 'src/app/models/daily-updates.model';

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


// // Update Project
// export const updateProject = createAction(
//   '[Project] UpdateProject',
//   props<{ id: string, payload: IUpdateProjectPayload }>()
// );

// export const updateProjectSuccess = createAction(
//   '[Project] UpdateProjectSuccess',
//   props<{ res: IUpdateProjectResponse }>()
// );

// export const updateProjectError = createAction(
//   '[Project] UpdateProjectError',
//   props<{ error: any }>()
// );
