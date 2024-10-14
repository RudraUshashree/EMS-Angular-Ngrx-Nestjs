import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { IAddDailyUpdatePayload, IDailyUpdate, IDailyUpdatesResponse } from '../models/daily-updates.model';

@Injectable({
  providedIn: 'root'
})
export class DailyUpdatesService {

  /**
   * Constructor for ProjectService, injecting the HttpClient service.
   *
   * @param http - The HttpClient service to make HTTP requests to the backend.
   */
  constructor(private http: HttpClient) { }

  /**
  * Adds new daily update for an employee.
  *
  * @param addDailyUpdateData - The data for the project being added ().
  * @returns Observable with the response after adding the project ().
  */
  addDailyUpdate(addDailyUpdateData: IAddDailyUpdatePayload): Observable<IDailyUpdatesResponse> {
    return this.http.post<IDailyUpdatesResponse>(`${environment.api_url}/daily-update/add`, addDailyUpdateData);
  }

  /**
   * Fetches the all daily updates.
   *
   * @returns Observable with the daily updates data (IDailyUpdate).
   */
  getDailyUpdates(): Observable<IDailyUpdate[]> {
    return this.http.get<IDailyUpdate[]>(`${environment.api_url}/daily-update`);
  }

  /**
   * Fetches the daily updates of a specific employee by their ID.
   *
   * @param empId - The ID of the employee whose daily updates are to be fetched.
   * @returns Observable with the employee's daily update data (IDailyUpdate).
   */
  getEmployeeDailyUpdates(empId: string): Observable<IDailyUpdate[]> {
    return this.http.get<IDailyUpdate[]>(`${environment.api_url}/daily-update/${empId}`);
  }

  // /**
  //  * Updates the status of a specific project.
  //  *
  //  * @param id - The ID of the project to be updated.
  //  * @param updatedProjectData - The new status to update for the project.
  //  * @returns Observable with the response after updating the project status (IUpdateEmployeeLeaveStatusResponse).
  //  */
  // updateProject(id: string, updatedProjectData: IUpdateProjectPayload): Observable<IUpdateProjectResponse> {
  //   return this.http.put<IUpdateProjectResponse>(`${environment.api_url}/project/${id}`, updatedProjectData);
  // }
}
