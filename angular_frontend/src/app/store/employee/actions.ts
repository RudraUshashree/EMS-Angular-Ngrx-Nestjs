import { createAction, props } from '@ngrx/store';
import { IEmployee, IUpdateEmployeePayload, IUpdateEmployeeResponse } from 'src/app/models/employee.model';

// Get All Employees
export const getEmployees = createAction(
  '[Employee] GetEmployees'
);

export const getEmployeesSuccess = createAction(
  '[Employee] GetEmployeesSuccess',
  props<{ res: IEmployee[] }>()
);

export const getEmployeesError = createAction(
  '[Employee] GetEmployeesError',
  props<{ error: any }>()
);


//Get Employee
export const getOneEmployee = createAction(
  '[Employee] GetOneEmployee',
  props<{ empId: string }>()
);

export const getOneEmployeeSuccess = createAction(
  '[Employee] GetOneEmployeeSuccess',
  props<{ res: IEmployee }>()
);

export const getOneEmployeeError = createAction(
  '[Employee] GetOneEmployeeError',
  props<{ error: any }>()
);


// Update Employee
export const updateEmployee = createAction(
  '[Employee] UpdateEmployee',
  props<{ empId: string, payload: IUpdateEmployeePayload }>()
);
export const updateEmployeeSuccess = createAction(
  '[Employee] UpdateEmployeeSuccess',
  props<{ res: IUpdateEmployeeResponse }>()
);
export const updateEmployeeError = createAction(
  '[Employee] UpdateEmployeeError',
  props<{ error: any }>()
);

// Update Employee Status
export const updateEmployeeStatus = createAction(
  '[Employee] UpdateEmployeeStatus',
  props<{ empId: string, payload: IUpdateEmployeePayload }>()
);
export const updateEmployeeStatusSuccess = createAction(
  '[Employee] UpdateEmployeeStatusSuccess',
  props<{ res: IUpdateEmployeeResponse }>()
);
export const updateEmployeeStatusError = createAction(
  '[Employee] UpdateEmployeeStatusError',
  props<{ error: any }>()
);


// Filter Employee Data
export const filterEmployees = createAction(
  '[Employee] filterEmployees',
  props<{ employeeType: string, workedTechnologies: string[] }>()
);

export const filterEmployeesSuccess = createAction(
  '[Employee] filterEmployeesSuccess',
  props<{ res: IEmployee[] }>()
);

export const filterEmployeesError = createAction(
  '[Employee] filterEmployeesError',
  props<{ error: any }>()
);


// Search Employee
export const searchEmployees = createAction(
  '[Employee] searchEmployees',
  props<{ searchName: string }>()
);

export const searchEmployeesSuccess = createAction(
  '[Employee] searchEmployeesSuccess',
  props<{ res: IEmployee[] }>()
);

export const searchEmployeesError = createAction(
  '[Employee] searchEmployeesError',
  props<{ error: any }>()
);
