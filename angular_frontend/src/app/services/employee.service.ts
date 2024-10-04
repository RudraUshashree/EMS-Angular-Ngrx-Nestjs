import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { IEmployee, IUpdateEmployeePayload, IUpdateEmployeeResponse } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  /**
  * Constructor for EmployeeService, injecting the HttpClient service.
  * @param http - The HttpClient service to make HTTP requests to the backend.
  */
  constructor(private http: HttpClient) { }

  /**
   * Fetches the list of all employees from the backend.
   * @returns Observable with the list of employees (IEmployee[]).
   */
  getEmployees(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(`${environment.api_url}/employee`);
  }

  /**
  * Fetches the details of a specific employee by ID.
  * @param id - The ID of the employee to retrieve.
  * @returns Observable with the employee details (IEmployee).
  */
  getEmployee(id: string): Observable<IEmployee> {
    return this.http.get<IEmployee>(`${environment.api_url}/employee/${id}`);
  }

  /**
   * Updates the data of an existing employee.
   * @param id - The ID of the employee to update.
   * @param updatedData - The updated employee data (IUpdateEmployeePayload).
   * @returns Observable with the response after updating the employee data (IUpdateEmployeeResponse).
   */
  updateEmployeeData(id: string, updatedData: IUpdateEmployeePayload): Observable<IUpdateEmployeeResponse> {
    return this.http.put<IUpdateEmployeeResponse>(`${environment.api_url}/employee/${id}`, updatedData);
  }

  /**
  * Searches for employees by their name.
  * @param searchName - The name or part of the name to search for.
  * @returns Observable with the list of employees matching the search criteria (IEmployee[]).
  */
  searchEmployeesByName(searchName: string): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(`${environment.api_url}/employee/search?searchTerm=${searchName}`)
  }

  /**
 * Filters employees based on employee type and worked technologies.
 * @param empType - The employee type (e.g., "admin", "developer").
 * @param workedTechnologies - An array of technologies that the employee has worked with.
 * @returns Observable with the list of employees matching the filter criteria (IEmployee[]).
 */
  filterEmployees(empType: string, workedTechnologies: string[]): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(`${environment.api_url}/employee/filter?employeeType=${empType}&workedTechnologies=${workedTechnologies}`);
  }
}
