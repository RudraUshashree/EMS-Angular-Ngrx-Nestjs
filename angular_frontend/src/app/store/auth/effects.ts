import { SnackBarService } from './../../services/snackbar.service';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "src/app/services/auth.service";
import { login, loginError, loginSuccess, signup, signupError, signupSuccess } from "./actions";
import { catchError, exhaustMap, map, of } from "rxjs";
import { ILoginPayload, ILoginResponse, ISignupResponse } from 'src/app/models/auth.model';

@Injectable()
export class AuthEffects  {

  constructor(private actions$: Actions, private authService: AuthService, private snackBarService:SnackBarService) { }

  login$ = createEffect(() => this.actions$.pipe(
    ofType(login.type),
    exhaustMap((props: { payload: ILoginPayload, type: string }) =>
      this.authService.login(props.payload).pipe(
        map((res: ILoginResponse) => {
          this.authService.initiateLogin(res.user, res.token);
          return { type: loginSuccess.type, res };
        }),
        catchError((error) => {
          this.snackBarService.openAlert({message: error, type: "error"})
          return of({ type: loginError.type, error })})
      )
    )
  ));

  signup$ = createEffect(() => this.actions$.pipe(
    ofType(signup.type),
    exhaustMap((props: { payload: FormData, type: string }) =>
      this.authService.signUpEmployee(props.payload).pipe(
        map((res: ISignupResponse) => {
          if(res){
            this.snackBarService.openAlert({message: res.message, type: "success"})
          }
          return { type: signupSuccess.type, res }}
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({message: errorMsg, type: "error"})
          return of({ type: signupError.type, error })})
      )
    )
  ));
}
