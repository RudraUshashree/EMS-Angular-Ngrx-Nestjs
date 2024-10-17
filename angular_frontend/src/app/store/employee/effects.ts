import { SnackBarService } from './../../services/snackbar.service';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of } from "rxjs";
import {
  filterEmployees,
  filterEmployeesError,
  filterEmployeesSuccess,
  getEmployees,
  getEmployeesError,
  getEmployeesSuccess,
  getOneEmployee,
  getOneEmployeeError,
  getOneEmployeeSuccess,
  searchEmployees,
  searchEmployeesError,
  searchEmployeesSuccess,
  updateEmployee,
  updateEmployeeError,
  updateEmployeeStatus,
  updateEmployeeStatusError,
  updateEmployeeStatusSuccess,
  updateEmployeeSuccess
} from './actions';
import { IEmployee, IUpdateEmployeePayload, IUpdateEmployeeResponse } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { Store } from '@ngrx/store';
import { AppState } from '../reducer';

@Injectable()
export class EmployeeEffects {

  constructor(
    private actions$: Actions,
    private employeeService: EmployeeService,
    private snackBarService: SnackBarService,
    private store: Store<AppState>
  ) { }

  getEmployees$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployees.type),
    exhaustMap(() =>
      this.employeeService.getEmployees().pipe(
        map((res: IEmployee[]) => ({ type: getEmployeesSuccess.type, res })
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: getEmployeesError.type, error })
        })
      )
    )
  ));

  getOneEmployee$ = createEffect(() => this.actions$.pipe(
    ofType(getOneEmployee.type),
    exhaustMap((props: { empId: string, type: string }) =>
      this.employeeService.getEmployee(props.empId).pipe(
        map((res: IEmployee) => {
          return { type: getOneEmployeeSuccess.type, res };
        }),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: getOneEmployeeError.type, error })
        })
      )
    )
  ));

  updateEmployee$ = createEffect(() => this.actions$.pipe(
    ofType(updateEmployee.type),
    exhaustMap((props: { empId: string, payload: IUpdateEmployeePayload, type: string }) =>
      this.employeeService.updateEmployeeData(props.empId, props.payload).pipe(
        map((res: IUpdateEmployeeResponse) => {
          if (res) {
            this.snackBarService.openAlert({ message: res.message, type: "success" });
            this.store.dispatch(getEmployees());
          }
          return { type: updateEmployeeSuccess.type, res }
        }
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: updateEmployeeError.type, error })
        })
      )
    )
  ));

  // Update Employee Status
  updateEmployeeStatus$ = createEffect(() => this.actions$.pipe(
    ofType(updateEmployeeStatus.type),
    exhaustMap((props: { empId: string, payload: IUpdateEmployeePayload, type: string }) =>
      this.employeeService.updateEmployeeData(props.empId, props.payload).pipe(
        map((res: IUpdateEmployeeResponse) => {
          if (res) {
            this.snackBarService.openAlert({ message: res.message, type: "success" })
          }
          return { type: updateEmployeeStatusSuccess.type, res }
        }
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: updateEmployeeStatusError.type, error })
        })
      )
    )
  ));

  //Filter Employee Data
  filterEmployees$ = createEffect(() => this.actions$.pipe(
    ofType(filterEmployees.type),
    exhaustMap((props: { employeeType: string, workedTechnologies: string[], type: string }) =>
      this.employeeService.filterEmployees(props.employeeType, props.workedTechnologies).pipe(
        map((res: IEmployee[]) => {
          return { type: filterEmployeesSuccess.type, res };
        }),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: filterEmployeesError.type, error })
        })
      )
    )
  ));

  //Search Employee
  searchEmployees$ = createEffect(() => this.actions$.pipe(
    ofType(searchEmployees.type),
    exhaustMap((props: { searchName: string, type: string }) =>
      this.employeeService.searchEmployeesByName(props.searchName).pipe(
        map((res: IEmployee[]) => {
          return { type: searchEmployeesSuccess.type, res };
        }),
        catchError((error) => {
          this.snackBarService.openAlert({ message: error, type: "error" })
          return of({ type: searchEmployeesError.type, error })
        })
      )
    )
  ));
}
