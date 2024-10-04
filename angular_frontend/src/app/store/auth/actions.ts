import { createAction, props } from '@ngrx/store';
import { ILoginPayload, ILoginResponse, ISignupPayload, ISignupResponse } from 'src/app/models/auth.model';

export const login = createAction(
  '[Auth] Login',
  props<{ payload: ILoginPayload }>()
);
export const loginSuccess = createAction(
  '[Auth] LoginSuccess',
  props<{ res: ILoginResponse }>()
);
export const loginError = createAction(
  '[Auth] LoginError',
  props<{ error: any }>()
);

export const signup = createAction(
  '[Auth] Signup',
  props<{ payload: FormData }>()
);
export const signupSuccess = createAction(
  '[Auth] SignupSuccess',
  props<{ res: ISignupResponse }>()
);
export const signupError = createAction(
  '[Auth] SignupError',
  props<{ error: any }>()
);
