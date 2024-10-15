import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutes } from './auth.routing';
import { RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthComponent } from './auth.component';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminSignUpComponent } from './admin-sign-up/admin-sign-up.component';

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    SignInComponent,
    SignUpComponent,
    AdminSignUpComponent,
    RouterModule.forChild(AdminRoutes),
    DemoMaterialModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    AuthComponent
  ]
})
export class AuthModule { }
