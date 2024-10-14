import { SnackBarService } from '../../services/snackbar.service';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addProject, addProjectError, addProjectSuccess, getEmployeeProjects, getEmployeeProjectsError, getEmployeeProjectsSuccess, getProjects, getProjectsError, getProjectsSuccess, updateProject, updateProjectError, updateProjectSuccess } from "./actions";
import { catchError, exhaustMap, map, of } from "rxjs";
import {
} from 'src/app/models/leaves.model';
import { IAddProjectPayload, IAddProjectResponse, IProject, IUpdateProjectPayload, IUpdateProjectResponse } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';

@Injectable()
export class ProjectEffects {

  constructor(private actions$: Actions, private projectService: ProjectService, private snackBarService: SnackBarService) { }

  //Add Project
  addProject$ = createEffect(() => this.actions$.pipe(
    ofType(addProject.type),
    exhaustMap((props: { payload: IAddProjectPayload, type: string }) =>
      this.projectService.addProject(props.payload).pipe(
        map((res: IAddProjectResponse) => {
          this.snackBarService.openAlert({ message: res.message, type: "success" })
          return { type: addProjectSuccess.type, res };
        }),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: addProjectError.type, error })
        })
      )
    )
  ));

  //Get All Projects
  getProjects$ = createEffect(() => this.actions$.pipe(
    ofType(getProjects.type),
    exhaustMap(() =>
      this.projectService.getProjects().pipe(
        map((res: IProject[]) => ({ type: getProjectsSuccess.type, res })
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: getProjectsError.type, error })
        })
      )
    )
  ));

  //Get Employee Projects
  getEmployeeProjects$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeProjects.type),
    exhaustMap((props: { empId: string, type: string }) =>
      this.projectService.getEmployeeProjects(props.empId).pipe(
        map((res: IProject[]) => ({ type: getEmployeeProjectsSuccess.type, res })
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" });
          return of({ type: getEmployeeProjectsError.type, error })
        })
      )
    )
  ));

  // Update Project
  updateProject$ = createEffect(() => this.actions$.pipe(
    ofType(updateProject.type),
    exhaustMap((props: { id: string, payload: IUpdateProjectPayload, type: string }) =>
      this.projectService.updateProject(props.id, props.payload).pipe(
        map((res: IUpdateProjectResponse) => {
          if (res) {
            this.snackBarService.openAlert({ message: res.message, type: "success" })
          }
          return { type: updateProjectSuccess.type, res }
        }
        ),
        catchError((error) => {
          const errorMsg = error?.error?.message;
          this.snackBarService.openAlert({ message: errorMsg, type: "error" })
          return of({ type: updateProjectError.type, error })
        })
      )
    )
  ));
}
