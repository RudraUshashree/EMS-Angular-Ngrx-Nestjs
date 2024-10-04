import { Routes } from '@angular/router';
import { ManageLeavesComponent } from './manage-leaves/manage-leaves.component';
import { AuthGuard } from '../shared/auth.gaurd';

export const EmployeeRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./emp-dashboard/emp-dashboard.module').then(m => m.EmployeeDashboardModule)
  },
  {
    path: 'leaves',
    component: ManageLeavesComponent,
    canActivate: [AuthGuard]
  }
];
