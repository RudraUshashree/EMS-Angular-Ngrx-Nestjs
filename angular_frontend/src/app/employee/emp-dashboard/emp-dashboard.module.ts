import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { EmployeeDashboardRoutes } from './emp-dashboard.routing';
import { EmployeeDashboardComponent } from './emp-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    RouterModule.forChild(EmployeeDashboardRoutes),
    EmployeeDashboardComponent,
  ],
})
export class EmployeeDashboardModule { }
