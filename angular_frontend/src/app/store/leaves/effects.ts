import { SnackBarService } from '../../services/snackbar.service';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  addLeave,
  addLeaveError,
  addLeaveSuccess,
  deleteEmployeeLeave,
  deleteEmployeeLeaveError,
  deleteEmployeeLeaveSuccess,
  filterEmployeesLeaves,
  filterEmployeesLeavesError,
  filterEmployeesLeavesSuccess,
  filterOneEmployeeLeaves,
  filterOneEmployeeLeavesError,
  filterOneEmployeeLeavesSuccess,
  getEmployeeLeaves,
  getEmployeeLeavesError,
  getEmployeeLeavesSuccess,
  getEmployeesLeaves,
  getEmployeesLeavesError,
  getEmployeesLeavesSuccess,
  updateEmployeeLeaveStatus,
  updateEmployeeLeaveStatusError,
  updateEmployeeLeaveStatusSuccess
} from "./actions";
import { catchError, exhaustMap, map, of } from "rxjs";
import {
  ILeave,
  ILeaveAddPayload,
  ILeaveAddResponse,
  ILeaveDeleteResponse,
  ILeavesResponse,
  IUpdateEmployeeLeaveStatusPayload,
  IUpdateEmployeeLeaveStatusResponse
} from 'src/app/models/leaves.model';
import { LeavesService } from 'src/app/services/leaves.service';

@Injectable()
export class LeaveEffects {

  constructor(private actions$: Actions, private leavesService: LeavesService, private snackBarService: SnackBarService) { }

  //Add Leaves
  addLeave$ = createEffect(() => this.actions$.pipe(
    ofType(addLeave.type),
    exhaustMap((props: { payload: ILeaveAddPayload, type: string }) =>
      this.leavesService.addLeaves(props.payload).pipe(
        map((res: ILeaveAddResponse) => {
          return { type: addLeaveSuccess.type, res };
        }),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: addLeaveError.type, error })
        })
      )
    )
  ));

  //Get All Employees Leaves
  getEmployeesLeaves$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeesLeaves.type),
    exhaustMap(() =>
      this.leavesService.getAllEmployeesLeaves().pipe(
        map((res: ILeavesResponse) => ({ type: getEmployeesLeavesSuccess.type, res })
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: getEmployeesLeavesError.type, error })
        })
      )
    )
  ));

  //Get Employee Leaves
  getEmployeeLeaves$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeLeaves.type),
    exhaustMap((props: { empId: string, type: string }) =>
      this.leavesService.getEmployeeLeaves(props.empId).pipe(
        map((res: ILeavesResponse) => ({ type: getEmployeeLeavesSuccess.type, res })
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" });
          return of({ type: getEmployeeLeavesError.type, error })
        })
      )
    )
  ));

  // Update Employee Status
  updateEmployeeLeaveStatus$ = createEffect(() => this.actions$.pipe(
    ofType(updateEmployeeLeaveStatus.type),
    exhaustMap((props: { id: string, payload: IUpdateEmployeeLeaveStatusPayload, type: string }) =>
      this.leavesService.updateEmployeeLeaveStatus(props.id, props.payload).pipe(
        map((res: IUpdateEmployeeLeaveStatusResponse) => {
          if (res) {
            this.snackBarService.openAlert({ message: res.message, type: "success" })
          }
          return { type: updateEmployeeLeaveStatusSuccess.type, res }
        }
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: updateEmployeeLeaveStatusError.type, error })
        })
      )
    )
  ));

  //Delete Employee
  deleteEmployeeLeave$ = createEffect(() => this.actions$.pipe(
    ofType(deleteEmployeeLeave.type),
    exhaustMap((props: { leaveId: string, noOfLeaves: number, type: string }) =>
      this.leavesService.deleteEmployeeLeave(props.leaveId, props.noOfLeaves).pipe(
        map((res: ILeaveDeleteResponse) => ({ type: deleteEmployeeLeaveSuccess.type, res })
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" });
          return of({ type: deleteEmployeeLeaveError.type, error })
        })
      )
    )
  ));

  //Filter Employees Leaves
  filterEmployeesLeaves$ = createEffect(() => this.actions$.pipe(
    ofType(filterEmployeesLeaves.type),
    exhaustMap((props: { leaveType: string, leaveStatus: string, type: string }) =>
      this.leavesService.filterEmployeesLeaves(props.leaveType, props.leaveStatus).pipe(
        map((res: ILeave[]) => {
          return { type: filterEmployeesLeavesSuccess.type, res };
        }),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: filterEmployeesLeavesError.type, error })
        })
      )
    )
  ));

  //Filter One Employee Leaves
  filterOneEmployeeLeaves$ = createEffect(() => this.actions$.pipe(
    ofType(filterOneEmployeeLeaves.type),
    exhaustMap((props: { empId: string, leaveType: string, type: string }) =>
      this.leavesService.filterOneEmployeeLeaves(props.empId, props.leaveType).pipe(
        map((res: ILeave[]) => {
          return { type: filterOneEmployeeLeavesSuccess.type, res };
        }),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: filterOneEmployeeLeavesError.type, error })
        })
      )
    )
  ));
}
