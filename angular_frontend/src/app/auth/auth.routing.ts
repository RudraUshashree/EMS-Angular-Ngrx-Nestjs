import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthComponent } from './auth.component';
import { AdminSignUpComponent } from './admin-sign-up/admin-sign-up.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'signin',
        component: SignInComponent
      },
      {
        path: 'signup',
        component: SignUpComponent
      },
      {
        path: 'admin-signup',
        component: AdminSignUpComponent
      }
    ],
  }
];
