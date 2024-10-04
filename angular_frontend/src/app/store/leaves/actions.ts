import { createAction, props } from '@ngrx/store';
import { ILeave, ILeaveAddPayload, ILeaveAddResponse, ILeaveDeleteResponse, ILeavesResponse, IUpdateEmployeeLeaveStatusPayload, IUpdateEmployeeLeaveStatusResponse } from 'src/app/models/leaves.model';

export const addLeave = createAction(
  '[Leave] Add Leave',
  props<{ payload: ILeaveAddPayload }>()
);
export const AddLeaveSuccess = createAction(
  '[Leave] AddLeaveSuccess',
  props<{ res: ILeaveAddResponse }>()
);
export const AddLeaveError = createAction(
  '[Leave] AddLeaveError',
  props<{ error: any }>()
);


// Get All Employees Leaves
export const getEmployeesLeaves = createAction(
  '[Leave] GetEmployeesLeaves'
);

export const getEmployeesLeavesSuccess = createAction(
  '[Leave] GetEmployeesLeavesSuccess',
  props<{ res: ILeave[] }>()
);

export const getEmployeesLeavesError = createAction(
  '[Leave] GetEmployeesError',
  props<{ error: any }>()
);


// Get Employee Leaves
export const getEmployeeLeaves = createAction(
  '[Leave] GetEmployeeLeaves',
  props<{ empId: string }>()
);

export const getEmployeeLeavesSuccess = createAction(
  '[Leave] GetEmployeeLeavesSuccess',
  props<{ res: ILeavesResponse }>()
);

export const getEmployeeLeavesError = createAction(
  '[Leave] GetEmployeeLeavesError',
  props<{ error: any }>()
);


// Update Employee Leave Status
export const updateEmployeeLeaveStatus = createAction(
  '[Leave] UpdateEmployeeLeaveStatus',
  props<{ id: string, payload: IUpdateEmployeeLeaveStatusPayload }>()
);

export const updateEmployeeLeaveStatusSuccess = createAction(
  '[Leave] UpdateEmployeeLeaveStatusSuccess',
  props<{ res: IUpdateEmployeeLeaveStatusResponse }>()
);

export const updateEmployeeLeaveStatusError = createAction(
  '[Leave] UpdateEmployeeLeaveStatusError',
  props<{ error: any }>()
);


// Delete Employee Leaves
export const deleteEmployeeLeave = createAction(
  '[Leave] DeleteEmployeeLeave',
  props<{ leaveId: string, noOfLeaves: number }>()
);

export const deleteEmployeeLeaveSuccess = createAction(
  '[Leave] DeleteEmployeeLeaveSuccess',
  props<{ res: ILeaveDeleteResponse }>()
);

export const deleteEmployeeLeaveError = createAction(
  '[Leave] DeleteEmployeeLeaveError',
  props<{ error: any }>()
);

// Filter Employees Leaves
export const filterEmployeesLeaves = createAction(
  '[Leave] filterEmployeesLeaves',
  props<{ leaveType: string, leaveStatus: string }>()
);

export const filterEmployeesLeavesSuccess = createAction(
  '[Leave] filterEmployeesLeavesSuccess',
  props<{ res: ILeave[] }>()
);

export const filterEmployeesLeavesError = createAction(
  '[Leave] filterEmployeesLeavesError',
  props<{ error: any }>()
);


// Filter One Employee Leaves
export const filterOneEmployeeLeaves = createAction(
  '[Leave] filterOneEmployeeLeaves',
  props<{ empId: string, leaveType: string }>()
);

export const filterOneEmployeeLeavesSuccess = createAction(
  '[Leave] filterOneEmployeeLeavesSuccess',
  props<{ res: ILeave[] }>()
);

export const filterOneEmployeeLeavesError = createAction(
  '[Leave] filterOneEmployeeLeavesError',
  props<{ error: any }>()
);
