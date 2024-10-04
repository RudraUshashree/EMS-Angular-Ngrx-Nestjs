import { createReducer, on } from '@ngrx/store';
import { addLeave, AddLeaveError, AddLeaveSuccess, deleteEmployeeLeave, deleteEmployeeLeaveError, deleteEmployeeLeaveSuccess, filterEmployeesLeaves, filterEmployeesLeavesError, filterEmployeesLeavesSuccess, filterOneEmployeeLeaves, filterOneEmployeeLeavesError, filterOneEmployeeLeavesSuccess, getEmployeeLeaves, getEmployeeLeavesError, getEmployeeLeavesSuccess, getEmployeesLeaves, getEmployeesLeavesError, getEmployeesLeavesSuccess, updateEmployeeLeaveStatus, updateEmployeeLeaveStatusError, updateEmployeeLeaveStatusSuccess } from './actions';
import { ILeave, ILeaveAddResponse, ILeavesResponse, IUpdateEmployeeLeaveStatusResponse } from 'src/app/models/leaves.model';

export interface LeaveState {
  loading: boolean;
  addLeave: ILeaveAddResponse | null;
  leave: ILeave | null;
  error: any;
  leaves: ILeavesResponse | null;
  updatedleave: IUpdateEmployeeLeaveStatusResponse | null
}

export const initialState: LeaveState = {
  loading: false,
  addLeave: null,
  leave: null,
  error: null,
  leaves: null,
  updatedleave: null
};

export const leaveReducer = createReducer(
  initialState,

  // Add Leave
  on(addLeave, (state): LeaveState => ({ ...state, loading: true })),
  on(AddLeaveSuccess, (state, { res }): LeaveState => {
    return { ...state, loading: false, addLeave: res, leaves: { balanced_leaves: res.balanced_leaves, leaves: [res.leave, ...(state.leaves?.leaves ?? [])] } };
    // return { ...state, loading: false, addLeave : res, leaves: { balanced_leaves: res.balanced_leaves, leaves: [...(state.leaves?.leaves ?? []), res.leave]}};
    // return { ...state, loading: false, addLeave : res, leaves: [res.leave, ...(state.leaves ?? [])] };
  }),
  on(AddLeaveError, (state, { error }): LeaveState => ({ ...state, loading: false, error })),

  // Get All Employees Leaves
  on(getEmployeesLeaves, (state): LeaveState => ({ ...state, loading: true })),
  // on(getEmployeesLeavesSuccess, (state, { res }) => ({ ...state, loading: false, leaves: res })),
  on(getEmployeesLeavesSuccess, (state, { res }): LeaveState => {
    return { ...state, loading: false, leaves: { balanced_leaves: 0, leaves: res } }
  }),

  on(getEmployeesLeavesError, (state, { error }): LeaveState => ({ ...state, loading: false, error })),

  // Get Employee Leaves
  on(getEmployeeLeaves, (state): LeaveState => ({ ...state, loading: true })),
  on(getEmployeeLeavesSuccess, (state, { res }): LeaveState => ({ ...state, loading: false, leaves: res })),
  on(getEmployeeLeavesError, (state, { error }) => ({ ...state, loading: false, error })),

  // Update Employee Status
  on(updateEmployeeLeaveStatus, (state) => ({ ...state, loading: true })),
  on(updateEmployeeLeaveStatusSuccess, (state, { res }): LeaveState => {
    if (!state.leaves) {
      return { ...state, loading: false };
    }

    const leaveIndex = state.leaves.leaves.findIndex(leave => leave._id === res.leave._id);
    //   Check if the leave exists in the current state
    if (leaveIndex > -1) {
      const updatedLeaves = [
        ...state.leaves.leaves.slice(0, leaveIndex),
        res.leave,
        ...state.leaves.leaves.slice(leaveIndex + 1)
      ];
      return { ...state, loading: false, leaves: {balanced_leaves : 0, leaves: updatedLeaves} };
    }

    // If leave not found, return the state without modifications
    return { ...state, loading: false };
  }),
  on(updateEmployeeLeaveStatusError, (state, { error }) => ({ ...state, loading: false, error })),

  // Delete Employee Leaves
  on(deleteEmployeeLeave, (state): LeaveState => ({ ...state, loading: true })),
  on(deleteEmployeeLeaveSuccess, (state, { res }): LeaveState => {
    const leavesArray: ILeave[] = state.leaves?.leaves ?? [];
    const updatedLeavesArray = leavesArray.filter(item => item._id !== res.leaveId);
    return { ...state, loading: false, leaves: { balanced_leaves: res.balanced_leaves, leaves: updatedLeavesArray } }
  }),
  on(deleteEmployeeLeaveError, (state, { error }) => ({ ...state, loading: false, error })),


  // Filter Employees Leaves
  on(filterEmployeesLeaves, (state) => ({ ...state, loading: true })),
  on(filterEmployeesLeavesSuccess, (state, { res }) => ({ ...state, loading: false, leaves: {balanced_leaves: 0, leaves: res} })),
  on(filterEmployeesLeavesError, (state, { error }) => ({ ...state, loading: false, error })),

  // Filter One Employee Leaves
  on(filterOneEmployeeLeaves, (state) => ({ ...state, loading: true })),
  on(filterOneEmployeeLeavesSuccess, (state, { res }) => ({ ...state, loading: false, leaves: {balanced_leaves: 0, leaves: res} })),
  on(filterOneEmployeeLeavesError, (state, { error }) => ({ ...state, loading: false, error }))
);
