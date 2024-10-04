import { createReducer, on } from '@ngrx/store';
import { IEmployee, IUpdateEmployeeResponse } from 'src/app/models/employee.model';
import { filterEmployees, filterEmployeesError, filterEmployeesSuccess, getEmployees, getEmployeesError, getEmployeesSuccess, getOneEmployee, getOneEmployeeError, getOneEmployeeSuccess, searchEmployees, searchEmployeesError, searchEmployeesSuccess, updateEmployee, updateEmployeeError, updateEmployeeStatus, updateEmployeeStatusError, updateEmployeeStatusSuccess, updateEmployeeSuccess } from './actions';

export interface EmployeesState {
  loading: boolean;
  employees: IEmployee[] | [];
  error: any;
  employee: IEmployee | null;
  updatedemployee: IUpdateEmployeeResponse | null
}

export const initialState: EmployeesState = {
  loading: false,
  employees: [],
  error: null,
  employee: null,
  updatedemployee: null
};

export const employeeReducer = createReducer(
  initialState,
  // Get Employees
  on(getEmployees, (state) => ({ ...state, loading: true })),
  on(getEmployeesSuccess, (state, { res }) => ({ ...state, loading: false, employees: res })),
  on(getEmployeesError, (state, { error }) => ({ ...state, loading: false, error })),

  // Get One Employee
  on(getOneEmployee, (state) => ({ ...state, loading: true })),
  on(getOneEmployeeSuccess, (state, { res }) => ({ ...state, loading: false, employee: res })),
  on(getOneEmployeeError, (state, { error }) => ({ ...state, loading: false, error })),

  // Update Employee
  on(updateEmployee, (state) => ({ ...state, loading: true })),
  on(updateEmployeeSuccess, (state, { res }) => ({ ...state, loading: false, employee: res.employee })),
  on(updateEmployeeError, (state, { error }) => ({ ...state, loading: false, error })),

   // Update Employee Status
   on(updateEmployeeStatus, (state) => ({ ...state, loading: true })),
   on(updateEmployeeStatusSuccess, (state, { res }): EmployeesState => {
     const employeeIndex = state.employees.findIndex(emp => emp._id === res.employee._id);
    //   Check if the employee exists in the current state
     if (employeeIndex > -1) {
       const updatedEmployees = [
         ...state.employees.slice(0, employeeIndex),
         res.employee,
         ...state.employees.slice(employeeIndex + 1)
       ];
       return { ...state, loading: false, employees: updatedEmployees };
     }

     // If employee not found, return the state without modifications
     return { ...state, loading: false };
   }),
   on(updateEmployeeStatusError, (state, { error }) => ({ ...state, loading: false, error })),

  // Filter Employees
  on(filterEmployees, (state) => ({ ...state, loading: true })),
  on(filterEmployeesSuccess, (state, { res }) => ({ ...state, loading: false, employees: res })),
  on(filterEmployeesError, (state, { error }) => ({ ...state, loading: false, error })),

  // Search Employees
  on(searchEmployees, (state) => ({ ...state, loading: true })),
  on(searchEmployeesSuccess, (state, { res }) => ({ ...state, loading: false, employees: res })),
  on(searchEmployeesError, (state, { error }) => ({ ...state, loading: false, error })),
);
