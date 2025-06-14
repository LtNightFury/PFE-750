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
import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ServiceComponent } from './components/service/service.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { MyAppointmentsComponent } from './components/my-appointments/my-appointments.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { OwnerDashComponent } from './owner-dashboard/owner-dash/owner-dash.component';
import { PropertyListDashComponent } from './owner-dashboard/property-list-dash/property-list-dash.component';
import { AuthGuard } from './login-register-verif/guards/auth.guard';
import { AppointmentsCalendarComponent } from './owner-dashboard/appointments-calendar/appointments-calendar.component';
import { DashDashComponent } from './owner-dashboard/dash-dash/dash-dash.component';
import { PropertyViewsComponent } from './components/property-views/property-views.component';
import { UserMessagesComponent } from './pages/user-messages/user-messages.component';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { AdminDashLayoutComponent } from './Admin-dashboard/admin-dash-layout/admin-dash-layout.component';
import { AdminDashboardComponent } from './Admin-dashboard/admin-dashboard/admin-dashboard.component';
import { AdminUserListComponent } from './Admin-dashboard/admin-user-list/admin-user-list.component';
import { AdminPropertyListComponent } from './Admin-dashboard/admin-property-list/admin-property-list.component';
import { AdminPropertyDeleteListComponent } from './Admin-dashboard/admin-property-delete-list/admin-property-delete-list.component';
import { OwnerBookingComponent } from './owner-dashboard/owner-booking/owner-booking.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email/:token', component: VerifyEmailComponent },
  { path: 'property/new', component: EditPropertyComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'property-list', component: PropertyListComponent },
  { path: 'property/:id', component: PropertyDetailComponent},
  { path: 'contact', component: ContactComponent },
  { path: 'about-us',component:AboutUsComponent},
  { path: 'service', component:ServiceComponent},
  
  
  {path: 'owner-dashboard', component: OwnerDashComponent},
  
  {path: 'propertyview', component: PropertyViewsComponent},
   { path: 'property/edit/:id', component: EditPropertyComponent },

    /*{ 
    path: 'appointments', 
    component: AppointmentsCalendarComponent 
  },*/
  //dont workzekfhezfh//
  {
    path:'user', component:UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'settings',
        component: UserSettingsComponent
      },
      { 
      path: 'my-appointments',
        component: MyAppointmentsComponent
      },
      {
        path: 'my-bookings',
        component: MyBookingsComponent
      },
      {
        path: 'messages',
        component: UserMessagesComponent
      } ,
      {
        path: 'history',
        component: PropertyViewsComponent
      },
      {path: '', redirectTo: 'profile', pathMatch: 'full'}
    ]

  },

  {
    path: 'owner',
    component: OwnerDashComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'owner-dash',
        component: DashDashComponent
      },
      {
        path: '',
        redirectTo: 'owner-dash',
        pathMatch: 'full'
      },
      {
        path: 'properties',
        component: PropertyListDashComponent
      },
      {
        path: 'calendar',
        component: AppointmentsCalendarComponent
      },
      
      {path: 'bookings',component: OwnerBookingComponent},
      {path: 'messages',component: UserMessagesComponent},
    ]
  },

  {
  path: 'admin',
  component: AdminDashLayoutComponent,
  children: [
    
    { path: 'dashboard', component: AdminDashboardComponent },
    { path: 'users', component: AdminUserListComponent },
    {path: 'properties-list',component: AdminPropertyListComponent},
    {path: 'properties',component: AdminPropertyDeleteListComponent},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    // Add more admin routes here
  ]
},
  
  //lena bech nhot el route ta3 el dashboard//
  { path: '', redirectTo: '/home', pathMatch: 'full' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
