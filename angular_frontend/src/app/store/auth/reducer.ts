import { createReducer, on } from '@ngrx/store';
import { IEmployee } from 'src/app/models/employee.model';
import {
  adminSignup,
  adminSignupError,
  adminSignupSuccess,
  login,
  loginError,
  loginSuccess,
  signup,
  signupError,
  signupSuccess
} from './actions';

export interface AuthState {
  loading: boolean;
  user: IEmployee | null;
  error: any;
  signupSuccess: boolean;
}

export const initialState: AuthState = {
  loading: false,
  user: null,
  error: null,
  signupSuccess: false,
};

export const authReducer = createReducer(
  initialState,
  // Login
  on(login, (state) => ({ ...state, loading: true })),
  on(loginSuccess, (state, { res }) => ({ ...state, loading: false, user: res.user })),
  on(loginError, (state, { error }) => ({ ...state, loading: false, error })),

  //Employee Signup
  on(signup, (state) => ({ ...state, loading: true, signupSuccess: false })),
  on(signupSuccess, (state) => ({ ...state, loading: false, signupSuccess: true })),
  on(signupError, (state, { error }) => ({ ...state, loading: false, error, signupSuccess: false })),

  //Admin Signup
  on(adminSignup, (state) => ({ ...state, loading: true, signupSuccess: false })),
  on(adminSignupSuccess, (state) => ({ ...state, loading: false, signupSuccess: true })),
  on(adminSignupError, (state, { error }) => ({ ...state, loading: false, error, signupSuccess: false })),
);
