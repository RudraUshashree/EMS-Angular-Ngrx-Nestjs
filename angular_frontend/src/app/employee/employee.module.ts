import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeeRoutes } from './employee.routing';

@NgModule({
  imports: [
    RouterModule.forChild(EmployeeRoutes)
  ],
})
export class EmployeeModule { }
