import { createReducer, on } from '@ngrx/store';
import {
  addProject,
  addProjectError,
  addProjectSuccess,
  getProjects,
  getProjectsError,
  getProjectsSuccess,
  updateProject,
  updateProjectError,
  updateProjectSuccess
} from './actions';
import { IAddProjectResponse, IProject } from 'src/app/models/project.model';

export interface ProjectState {
  loading: boolean;
  project: IProject | null;
  projects: IProject[];
  error: any;
  addProject: IAddProjectResponse | null;
}

export const initialState: ProjectState = {
  loading: false,
  project: null,
  projects: [],
  error: null,
  addProject: null,
};

export const projectReducer = createReducer(
  initialState,

  // Add Project
  on(addProject, (state): ProjectState => ({ ...state, loading: true })),
  on(addProjectSuccess, (state, { res }): ProjectState => {
    return { ...state, loading: false, addProject: res, projects: [res.project, ...(state.projects ?? [])] };
  }),
  on(addProjectError, (state, { error }): ProjectState => ({ ...state, loading: false, error })),

  // Get All Employees Leaves
  on(getProjects, (state): ProjectState => ({ ...state, loading: true })),
  on(getProjectsSuccess, (state, { res }): ProjectState => {
    return { ...state, loading: false, projects: res }
  }),
  on(getProjectsError, (state, { error }): ProjectState => ({ ...state, loading: false, error })),

  // Update Project
  on(updateProject, (state) => ({ ...state, loading: true })),
  on(updateProjectSuccess, (state, { res }): ProjectState => {
    if (!state.projects) {
      return { ...state, loading: false };
    }

    const projectIndex = state.projects.findIndex(project => project._id === res.project._id);
    //   Check if the project exists in the current state
    if (projectIndex > -1) {
      const updatedProjects = [
        ...state.projects.slice(0, projectIndex),
        res.project,
        ...state.projects.slice(projectIndex + 1)
      ];
      return { ...state, loading: false, projects: updatedProjects };
    }

    // If project not found, return the state without modifications
    return { ...state, loading: false };
  }),
  on(updateProjectError, (state, { error }) => ({ ...state, loading: false, error })),
);
