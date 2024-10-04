import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { IEmployee } from 'src/app/models/employee.model';
import { login } from 'src/app/store/auth/actions';
import { selectAuthLoading, selectAuthUser } from 'src/app/store/auth/selectors';
import { AppState } from 'src/app/store/reducer';
import { ILoginPayload } from 'src/app/models/auth.model';
import { SpinnerComponent } from 'src/app/shared/spinner.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    RouterModule,
    CommonModule,
    SpinnerComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SignInComponent implements OnInit {
  user$: Observable<IEmployee | null>;
  loading$: Observable<boolean>;
  public errorMsg: any;

  /**
  * Constructor to initialize the store and set up selectors for user and loading state.
  * @param store - The NgRx Store to dispatch and select actions and state
  */
  constructor(
    private store: Store<AppState>
  ) {
    this.user$ = this.store.select(selectAuthUser);
    this.loading$ = this.store.select(selectAuthLoading);
  }

  ngOnInit(): void { }

  /**
   * Form group for the login form with controls for email and password
   */
  LoginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'
      ),
    ]),
    password: new FormControl('', Validators.required),
  });

  /**
   * Getter for accessing form controls, primarily for use in the template.
   */
  get getFormData() {
    return this.LoginForm.controls;
  }

  /**
   * Function to handle the login process when the form is submitted.
   * If the form is valid, it dispatches the login action with the form data.
   */
  onLogin() {
    if (this.LoginForm.valid) {
      const formData = this.LoginForm.value;

      if (formData.email && formData.password) {
        const payload: ILoginPayload = {
          email: formData.email,
          password: formData.password
        }

        this.store.dispatch(login({ payload }));
      }
    }
  }
}
