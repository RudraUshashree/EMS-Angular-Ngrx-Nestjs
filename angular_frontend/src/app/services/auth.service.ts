import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { IEmployee } from '../models/employee.model';
import { IAdminSignupPayload, IAdminSignupResponse, ILoginPayload, ILoginResponse, ISignupResponse } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Constructor for AuthService, injecting necessary dependencies: HttpClient and Router.
   * @param http - The HttpClient service to make HTTP requests.
   * @param router - The Router service to navigate between application routes.
   */
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
  * Sends a login request to the server and returns the login response.
  * @param data - The login payload containing email and password.
  * @returns Observable with the server's response (ILoginResponse).
  */
  login(data: ILoginPayload) {
    const payload = { email: data.email, password: data.password };
    return this.http.post<ILoginResponse>(environment.api_url + '/auth/login', payload);
  }

  /**
  * Initiates login by saving the user details and token in local storage and session storage.
  * Redirects the user to the appropriate dashboard (admin or employee) based on their role.
  * @param user - The logged-in user object.
  * @param token - The authentication token returned from the server.
  */
  initiateLogin(user: IEmployee, token: string): void {
    if (user && token) {
      localStorage.setItem('token', token!);
      sessionStorage.setItem('loggedUserRole', user.role);
      sessionStorage.setItem('loggedUserName', user.name);
      if (user.role === "admin")
        this.router.navigate(['/admin']);
      else
        this.router.navigate(['/employee']);
    }
  }

  /**
   * Sends a signup request to add a new employee to the system.
   * @param payload - FormData containing employee details.
   * @returns Observable with the server's response (ISignupResponse).
   */
  signUpEmployee(payload: FormData) {
    return this.http.post<ISignupResponse>(`${environment.api_url}/employee/add-employee`, payload);
  }

  /**
   * Sends a signup request to add a new admin to the system.
   * @param payload - Containing admin details.
   * @returns Observable with the server's response (IAdminSignupResponse).
   */
  signUpAdmin(payload: IAdminSignupPayload) {
    return this.http.post<IAdminSignupResponse>(`${environment.api_url}/admin/add-admin`, payload);
  }

  /**
  * Checks if the user is logged in by checking for the existence of a token in localStorage.
  * @returns Boolean indicating whether the user is logged in (true if token exists, false otherwise).
  */
  IsLoggedIn() {
    return localStorage.getItem('token') != null;
  }

  /**
   * Retrieves the token from localStorage.
   * @returns The authentication token as a string.
   */
  getToken() {
    return localStorage.getItem('token') || '';
  }

  /**
   * Decodes the authentication token to retrieve the user ID.
   * @returns The user ID from the token, or an empty string if token decoding fails.
   */
  getUserIdFromToken(): string {
    const token = localStorage.getItem('token') ?? "";

    try {
      const decoded: any = jwtDecode(token);
      return decoded.userId;
    } catch (error) {
      console.error('Token decoding failed:', error);
      return token;
    }
  }

  /**
   * Logs out the user by clearing the token and user information from storage.
   * Redirects the user to the login page.
   */
  Logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('loggedUserName');
    sessionStorage.removeItem('loggedUserRole')
    this.router.navigate(['auth/signin']);
  }
}
