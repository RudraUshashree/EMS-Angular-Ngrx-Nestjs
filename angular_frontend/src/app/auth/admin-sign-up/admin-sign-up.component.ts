import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, take } from 'rxjs';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { adminSignup } from 'src/app/store/auth/actions';
import { selectAuthSignupSuccess } from 'src/app/store/auth/selectors';
import { AppState } from 'src/app/store/reducer';

@Component({
  selector: 'app-admin-sign-up',
  standalone: true,
  imports: [
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    RouterModule,
    NgFor,
    CommonModule
  ],
  templateUrl: './admin-sign-up.component.html',
  styleUrl: './admin-sign-up.component.scss'
})
export class AdminSignUpComponent {

  /**
   * Observable to track if the sign-up process was successful
   */
  private destroy$: Subject<void> = new Subject<void>();
  signupSuccess$: Observable<boolean>;

  /**
   * Constructor to initialize the store and setup selectors for sign-up success.
   * @param router - Angular Router for navigation
   * @param store - NgRx Store for dispatching actions and selecting state
   */
  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.signupSuccess$ = this.store.select(selectAuthSignupSuccess);
  }

  ngOnInit(): void { }

  // Form group for the sign-up form with controls for name, email, password, etc.
  adminSignUpForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  // For Password Eye Icon Button
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSignUp() {
    this.store.dispatch(adminSignup({ payload: this.adminSignUpForm.value }));

    this.signupSuccess$.pipe(take(2)).subscribe((success) => {
      if (success) {
        this.router.navigate(["auth/signin"]);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
