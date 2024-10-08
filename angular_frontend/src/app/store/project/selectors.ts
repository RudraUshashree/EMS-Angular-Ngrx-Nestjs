import { createSelector } from '@ngrx/store';
import { AppState } from '../reducer';
import { ProjectState } from './reducer';

export const selectProjectFeature = (state: AppState) => state.project;

export const selectProjectsLoading = createSelector(
  selectProjectFeature,
  (state: ProjectState) => state.loading
);

export const selectAddProject = createSelector(
  selectProjectFeature,
  (state: ProjectState) => state.addProject
);

export const selectProjects = createSelector(
  selectProjectFeature,
  (state: ProjectState) => state.projects
);
