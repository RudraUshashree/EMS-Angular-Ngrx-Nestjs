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

// Get Employee Projects
export const getEmployeeProjects = createAction(
  '[Project] GetEmployeeProjects',
  props<{ empId: string }>()
);

export const getEmployeeProjectsSuccess = createAction(
  '[Project] GetEmployeeProjectsSuccess',
  props<{ res: IProject[] }>()
);

export const getEmployeeProjectsError = createAction(
  '[Project] GetEmployeeProjectsError',
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


// Search Projects
export const searchProjects = createAction(
  '[Project] searchProjects',
  props<{ searchTerm: string }>()
);

export const searchProjectsSuccess = createAction(
  '[Project] searchProjectsSuccess',
  props<{ res: IProject[] }>()
);

export const searchProjectsError = createAction(
  '[Project] searchProjectsError',
  props<{ error: any }>()
);

// Filter Projects
export const filterProjects = createAction(
  '[Project] filterProjects',
  props<{ hours?: number | undefined, price?: number | undefined, status?: string | undefined }>()
);

export const filterProjectsSuccess = createAction(
  '[Project] filterProjectsSuccess',
  props<{ res: IProject[] }>()
);

export const filterProjectsError = createAction(
  '[Project] filterProjectsError',
  props<{ error: any }>()
);
