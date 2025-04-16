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
import { RangeDatePickerComponent } from './components/range-date-picker/range-date-picker.component';




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
    RangeDatePickerComponent,
    
    
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
   
    
    
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
