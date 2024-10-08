import { Routes } from '@angular/router';
import { ManageEmployeesLeavesComponent } from './manage-employees-leaves/manage-employees-leaves.component';
import { AuthGuard } from '../shared/auth.gaurd';
import { ManageEmployeesComponent } from './manage-employees/manage-employees.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'manage-employees',
    component: ManageEmployeesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage-leaves',
    component: ManageEmployeesLeavesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage-projects',
    component: ManageProjectsComponent,
    canActivate: [AuthGuard]
  }
];
