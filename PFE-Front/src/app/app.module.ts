import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login-register-verif/auth/login/login.component';
import { RegisterComponent } from './login-register-verif/auth/register/register.component';
import { ForgotPasswordComponent } from './login-register-verif/auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './login-register-verif/auth/verify-email/verify-email.component';
import { FooterComponent } from './layout/footer/footer.component';
import { EditPropertyComponent } from './pages/edit-property/edit-property.component';
import { ResetPasswordComponent } from './login-register-verif/auth/reset-password/reset-password.component';
import { HttpClientModule } from '@angular/common/http';  
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './layout/header/header.component';
import { GeneralTabComponent } from './components/tabs/general-tab/general-tab.component';
import { LocationTabComponent } from './components/tabs/location-tab/location-tab.component';
import { SpecificationTabComponent } from './components/tabs/specification-tab/specification-tab.component';
import { PriceTabComponent } from './components/tabs/price-tab/price-tab.component';
import { MediaTabComponent } from './components/tabs/media-tab/media-tab.component';
import { PublicationTabComponent } from './components/tabs/publication-tab/publication-tab.component';
import { ContactsTabComponent } from './components/tabs/contacts-tab/contacts-tab.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { MapComponent } from './components/map/map.component';
import { AmenitiesTabComponent } from './components/tabs/amenities-tab/amenities-tab.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PropertyListComponent } from './pages/property-list/property-list.component';
import { HomeComponent } from './pages/home/home.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './login-register-verif/interceptors/jwt.interceptor';
import { PropertyFilterComponent } from './components/property-filter/property-filter.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { Map2Component } from './components/map2/map2.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ServiceComponent } from './components/service/service.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { MyAppointmentsComponent } from './components/my-appointments/my-appointments.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { OwnerSidebarComponent } from './owner-dashboard/owner-sidebar/owner-sidebar.component';
import { OwnerDashComponent } from './owner-dashboard/owner-dash/owner-dash.component';
import { LucideAngularModule, Home, Building2, Calendar, MessageSquare, Wallet } from 'lucide-angular';
import { PropertyCard2Component } from './owner-dashboard/property-card2/property-card2.component';
import { PropertyListDashComponent } from './owner-dashboard/property-list-dash/property-list-dash.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppointmentsCalendarComponent } from './owner-dashboard/appointments-calendar/appointments-calendar.component';
import { BootstrapModalComponent } from './owner-dashboard/bootstrap-modal/bootstrap-modal.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    FooterComponent,
    EditPropertyComponent,
    ResetPasswordComponent,
    HeaderComponent,
    GeneralTabComponent,
    LocationTabComponent,
    SpecificationTabComponent,
    AmenitiesTabComponent,
    PriceTabComponent,
    MediaTabComponent,
    PublicationTabComponent,
    ContactsTabComponent,
    DropdownComponent,
    MapComponent,
    PropertyListComponent,
    HomeComponent,
    PropertyFilterComponent,
    PropertyCardComponent,
    PropertyDetailComponent,
    DateRangePickerComponent,
    Map2Component,
    ContactComponent,
    AboutUsComponent,
    ServiceComponent,
    ClickOutsideDirective,
    ProfileComponent,
    UserSettingsComponent,
    SidebarComponent,
    AppointmentFormComponent,
    MyAppointmentsComponent,
    MyBookingsComponent,
    OwnerSidebarComponent,
    OwnerDashComponent,
    PropertyCard2Component,
    PropertyListDashComponent,
  
    AppointmentsCalendarComponent,
        BootstrapModalComponent,
    
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    FullCalendarModule,
    MatDialogModule,
    MatSnackBarModule,
    LucideAngularModule.pick({ Home, Building2, Calendar, MessageSquare, Wallet }),
   
   
    
    
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
