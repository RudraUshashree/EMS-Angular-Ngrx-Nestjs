import { IAddEmployeePayload, IEmployee } from "./employee.model";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IEmployee;
  token: string;
}
export interface ISignupPayload extends IAddEmployeePayload{}

export interface ISignupResponse {
  message: string;
  employeeId: string;
}
