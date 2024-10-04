import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from 'src/app/shared/auth.gaurd';

export const DashboardRoutes: Routes = [{
  path: '',
  component: DashboardComponent,
  canActivate: [AuthGuard]
}];
