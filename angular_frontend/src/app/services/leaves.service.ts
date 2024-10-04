import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ILeave, ILeaveAddPayload, ILeaveAddResponse, ILeaveDeleteResponse, ILeavesResponse, IUpdateEmployeeLeaveStatusResponse } from '../models/leaves.model';

@Injectable({
  providedIn: 'root'
})
export class LeavesService {

  /**
   * Constructor for LeavesService, injecting the HttpClient service.
   *
   * @param http - The HttpClient service to make HTTP requests to the backend.
   */
  constructor(private http: HttpClient) { }

  /**
  * Adds new leaves for an employee.
  *
  * @param leaveData - The data for the leave being added (ILeaveAddPayload).
  * @returns Observable with the response after adding the leave (ILeaveAddResponse).
  */
  addLeaves(leaveData: ILeaveAddPayload): Observable<ILeaveAddResponse> {
    return this.http.post<ILeaveAddResponse>(`${environment.api_url}/leaves/add-leaves`, leaveData);
  }

  /**
   * Fetches the leaves of a specific employee by their ID.
   *
   * @param empId - The ID of the employee whose leaves are to be fetched.
   * @returns Observable with the employee's leave data (ILeavesResponse).
   */
  getEmployeeLeaves(empId: string): Observable<ILeavesResponse> {
    return this.http.get<ILeavesResponse>(`${environment.api_url}/leaves/emp-leaves/${empId}`);
  }

  /**
   * Fetches the leaves of all employees.
   *
   * @returns Observable with the list of all employees' leaves (ILeavesResponse).
   */
  getAllEmployeesLeaves(): Observable<ILeavesResponse> {
    return this.http.get<ILeavesResponse>(`${environment.api_url}/leaves`);
  }

  /**
   * Deletes a specific leave for an employee.
   *
   * @param leaveId - The ID of the leave to be deleted.
   * @param noOfLeaves - The number of leaves to be deleted.
   * @returns Observable with the response after deleting the leave (ILeaveDeleteResponse).
   */
  deleteEmployeeLeave(leaveId: string, noOfLeaves: number): Observable<ILeaveDeleteResponse> {
    return this.http.delete<ILeaveDeleteResponse>(`${environment.api_url}/leaves/${leaveId}/${noOfLeaves}`);
  }

  /**
   * Updates the status of a specific leave.
   *
   * @param id - The ID of the leave to be updated.
   * @param updatedStatus - The new status to update for the leave.
   * @returns Observable with the response after updating the leave status (IUpdateEmployeeLeaveStatusResponse).
   */
  updateEmployeeLeaveStatus(id: string, updatedStatus: any): Observable<IUpdateEmployeeLeaveStatusResponse> {
    return this.http.put<IUpdateEmployeeLeaveStatusResponse>(`${environment.api_url}/leaves/${id}`, updatedStatus);
  }

  /**
   * Filters employee leaves based on leave type and leave status.
   *
   * @param leaveType - The type of leave to filter by (e.g., "sick", "vacation").
   * @param leaveStatus - The status of the leave to filter by (e.g., "approved", "pending").
   * @returns Observable with the filtered leaves (ILeave[]).
   */
  filterEmployeesLeaves(leaveType: string, leaveStatus: string): Observable<ILeave[]> {
    return this.http.get<ILeave[]>(`${environment.api_url}/leaves/filter?leaveType=${leaveType}&leaveStatus=${leaveStatus}`);
  }

  /**
  * Filters the leaves of a specific employee by their ID and leave type.
  *
  * @param empId - The ID of the employee whose leaves are to be filtered.
  * @param leaveType - The type of leave to filter by (e.g., "sick", "vacation").
  * @returns Observable with the filtered leaves for the specific employee (ILeave[]).
  */
  filterOneEmployeeLeaves(empId: string, leaveType: string): Observable<ILeave[]> {
    return this.http.get<ILeave[]>(`${environment.api_url}/leaves/filter/${empId}?leaveType=${leaveType}`);
  }
}
