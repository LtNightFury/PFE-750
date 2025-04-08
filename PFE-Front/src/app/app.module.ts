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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
