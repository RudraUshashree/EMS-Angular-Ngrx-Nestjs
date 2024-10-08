import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { IAddProjectPayload, IAddProjectResponse, IProject, IUpdateProjectPayload, IUpdateProjectResponse } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  /**
   * Constructor for ProjectService, injecting the HttpClient service.
   *
   * @param http - The HttpClient service to make HTTP requests to the backend.
   */
  constructor(private http: HttpClient) { }

  /**
  * Adds new leaves for an employee.
  *
  * @param projectData - The data for the project being added ().
  * @returns Observable with the response after adding the project ().
  */
  addProject(projectData: IAddProjectPayload): Observable<IAddProjectResponse> {
    return this.http.post<IAddProjectResponse>(`${environment.api_url}/project/add-project`, projectData);
  }

  /**
   * Fetches the all projects.
   *
   * @returns Observable with the projects data (IProject).
   */
  getProjects(): Observable<IProject[]> {
    console.log('service');

    return this.http.get<IProject[]>(`${environment.api_url}/project`);
  }

  /**
   * Updates the status of a specific project.
   *
   * @param id - The ID of the project to be updated.
   * @param updatedProjectData - The new status to update for the project.
   * @returns Observable with the response after updating the project status (IUpdateEmployeeLeaveStatusResponse).
   */
  updateProject(id: string, updatedProjectData: IUpdateProjectPayload): Observable<IUpdateProjectResponse> {
    return this.http.put<IUpdateProjectResponse>(`${environment.api_url}/project/${id}`, updatedProjectData);
  }
}
