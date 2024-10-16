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
    return this.http.get<IProject[]>(`${environment.api_url}/project`);
  }

  /**
   * Fetches the projects of a specific employee by their ID.
   *
   * @param empId - The ID of the employee whose projects are to be fetched.
   * @returns Observable with the employee's projects data (IProject).
   */
  getEmployeeProjects(empId: string): Observable<IProject[]> {
    return this.http.get<IProject[]>(`${environment.api_url}/project/${empId}`);
  }

  /**
   * Updates a specific project.
   *
   * @param id - The ID of the project to be updated.
   * @param updatedProjectData - The new updated project data.
   * @returns Observable with the response after updating the project (IUpdateProjectResponse).
   */
  updateProject(id: string, updatedProjectData: IUpdateProjectPayload): Observable<IUpdateProjectResponse> {
    return this.http.put<IUpdateProjectResponse>(`${environment.api_url}/project/${id}`, updatedProjectData);
  }

  /**
   * Searches for projects by their name.
   * @param searchTerm - The title or client name or part of the title or client name to search for.
   * @returns Observable with the list of projects matching the search criteria (IProject[]).
   */
  searchProjectsByTitleAndClientName(searchTerm: string): Observable<IProject[]> {
    return this.http.get<IProject[]>(`${environment.api_url}/project/search?searchTerm=${searchTerm}`)
  }

  /**
   * Filters projects based on project type and worked technologies.
   * @param hours - The number of hours of a project.
   * @param price - The price of a project.
   * @param status - The status of a project (true for Active and false for Inactive).
   * @returns Observable with the list of projects matching the filter criteria (IProject[]).
   */
  filterProjects(hours?: number, price?: number, status?: string): Observable<IProject[]> {
    return this.http.get<IProject[]>(`${environment.api_url}/project/filter?hours=${hours}&price=${price}&status=${status}`);
  }
}
