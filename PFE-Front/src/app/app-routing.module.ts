import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login-register-verif/auth/login/login.component';
import { RegisterComponent } from './login-register-verif/auth/register/register.component';
import { ForgotPasswordComponent } from './login-register-verif/auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './login-register-verif/auth/verify-email/verify-email.component';
import { EditPropertyComponent } from './pages/edit-property/edit-property.component';
import { ResetPasswordComponent } from './login-register-verif/auth/reset-password/reset-password.component';
import { HomeComponent } from './pages/home/home.component';
import { PropertyListComponent } from './pages/property-list/property-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email/:token', component: VerifyEmailComponent },
  { path: 'edit', component: EditPropertyComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'property-list', component: PropertyListComponent },
  //lena bech nhot el route ta3 el dashboard//
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
