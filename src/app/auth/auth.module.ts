import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailLoginComponent } from './login/email-login/email-login.component';
import { GoogleSigninDirective } from './google-signin.directive';
import { PhoneLoginComponent } from './login/phone-login/phone-login.component';



@NgModule({
  declarations: [
    LoginComponent,
    EmailLoginComponent,
    GoogleSigninDirective,
    PhoneLoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
