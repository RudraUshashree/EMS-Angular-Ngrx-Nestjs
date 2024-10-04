import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { SnackBarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {

  /**
  * Constructor for TokenInterceptorService, injecting the AuthService and Router.
  *
  * @param inject - The Angular injector for obtaining instances of services.
  * @param router - The Angular router to navigate between pages in case of unauthorized access.
  */
  constructor(
    private inject: Injector,
    private router: Router,
    private snackBarService: SnackBarService
  ) { }

  /**
  * Intercepts HTTP requests to attach the JWT token to the request headers
  * and handles any authentication-related errors such as 401 Unauthorized.
  *
  * @param req - The outgoing HTTP request to be intercepted.
  * @param next - The next handler in the HTTP request pipeline.
  * @returns Observable of HttpEvent<any> representing the HTTP response or error.
  */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authservice = this.inject.get(AuthService);

    let jwtToken = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + authservice.getToken(),
      },
    });

    return next.handle(jwtToken).pipe(
      // Catch any errors that occur during the HTTP request
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // If it's a 401 Unauthorized, it means the token is invalid
          console.error('Unauthorized request - Invalid Token', error.error);
          // this.snackBarService.openAlert({ message: error?.error?.message, type: "error" });
          // Clear any stored token
          authservice.Logout();

          // Redirect to the sign-in page
          this.router.navigate(['auth/signin']);
        }

        // Pass the error to the caller
        return throwError(() => new Error(error.error.message));
      })
    );
  }
}
