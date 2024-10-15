import { SnackBarService } from '../../services/snackbar.service';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of } from "rxjs";
import { DailyUpdatesService } from 'src/app/services/daily-update.service';
import {
  getDailyUpdates,
  getDailyUpdatesError,
  getDailyUpdatesSuccess,
  getEmployeeDailyUpdates,
  getEmployeeDailyUpdatesError,
  getEmployeeDailyUpdatesSuccess,
  addDailyUpdate,
  addDailyUpdateSuccess,
  addDailyUpdateError,
  updateDailyUpdate,
  updateDailyUpdateSuccess,
  updateDailyUpdateError
} from './actions';
import {
  IAddDailyUpdatePayload,
  IDailyUpdate,
  IDailyUpdatesResponse,
  IUpdateDailyUpdatePayload
} from 'src/app/models/daily-updates.model';

@Injectable()
export class DailyUpdatesEffects {

  constructor(
    private actions$: Actions,
    private dailyUpdatesService: DailyUpdatesService,
    private snackBarService: SnackBarService
  ) { }

  //Add Daily Update
  addDailyUpdate$ = createEffect(() => this.actions$.pipe(
    ofType(addDailyUpdate.type),
    exhaustMap((props: { payload: IAddDailyUpdatePayload, type: string }) =>
      this.dailyUpdatesService.addDailyUpdate(props.payload).pipe(
        map((res: IDailyUpdatesResponse) => {
          this.snackBarService.openAlert({ message: res.message, type: "success" })
          return { type: addDailyUpdateSuccess.type, res };
        }),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: addDailyUpdateError.type, error })
        })
      )
    )
  ));

  //Get All Daily Updates
  getDailyUpdates$ = createEffect(() => this.actions$.pipe(
    ofType(getDailyUpdates.type),
    exhaustMap(() =>
      this.dailyUpdatesService.getDailyUpdates().pipe(
        map((res: IDailyUpdate[]) => ({ type: getDailyUpdatesSuccess.type, res })
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: getDailyUpdatesError.type, error })
        })
      )
    )
  ));

  //Get Employee Daily Updates
  getEmployeeDailyUpdates$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeDailyUpdates.type),
    exhaustMap((props: { empId: string, type: string }) =>
      this.dailyUpdatesService.getEmployeeDailyUpdates(props.empId).pipe(
        map((res: IDailyUpdate[]) => ({ type: getEmployeeDailyUpdatesSuccess.type, res })
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" });
          return of({ type: getEmployeeDailyUpdatesError.type, error })
        })
      )
    )
  ));

  // Update Daily Update
  updateDailyUpdate$ = createEffect(() => this.actions$.pipe(
    ofType(updateDailyUpdate.type),
    exhaustMap((props: { id: string, payload: IUpdateDailyUpdatePayload, type: string }) =>
      this.dailyUpdatesService.updateProject(props.id, props.payload).pipe(
        map((res: IDailyUpdatesResponse) => {
          if (res) {
            this.snackBarService.openAlert({ message: res.message, type: "success" })
          }
          return { type: updateDailyUpdateSuccess.type, res }
        }
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: updateDailyUpdateError.type, error })
        })
      )
    )
  ));
}
