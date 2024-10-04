import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth.gaurd';
import { EmployeeDashboardComponent } from './emp-dashboard.component';

export const EmployeeDashboardRoutes: Routes = [{
  path: '',
  component: EmployeeDashboardComponent,
  canActivate: [AuthGuard]
}];
