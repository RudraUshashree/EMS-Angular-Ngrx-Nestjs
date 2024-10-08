import { createAction, props } from '@ngrx/store';
import { IAddProjectPayload, IAddProjectResponse, IProject, IUpdateProjectPayload, IUpdateProjectResponse } from 'src/app/models/project.model';

export const addProject = createAction(
  '[Project] Add Project',
  props<{ payload: IAddProjectPayload }>()
);
export const addProjectSuccess = createAction(
  '[Project] AddProjectSuccess',
  props<{ res: IAddProjectResponse }>()
);
export const addProjectError = createAction(
  '[Project] AddProjectError',
  props<{ error: any }>()
);


// Get All Projects
export const getProjects = createAction(
  '[Project] GetProjects'
);

export const getProjectsSuccess = createAction(
  '[Project] GetProjectsSuccess',
  props<{ res: IProject[] }>()
);

export const getProjectsError = createAction(
  '[Project] GetProjectsError',
  props<{ error: any }>()
);


// Update Project
export const updateProject = createAction(
  '[Project] UpdateProject',
  props<{ id: string, payload: IUpdateProjectPayload }>()
);

export const updateProjectSuccess = createAction(
  '[Project] UpdateProjectSuccess',
  props<{ res: IUpdateProjectResponse }>()
);

export const updateProjectError = createAction(
  '[Project] UpdateProjectError',
  props<{ error: any }>()
);
