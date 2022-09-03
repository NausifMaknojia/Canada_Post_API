import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';

import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ApiRequestService } from './shared/api-request.service';
import { ProvinceCityService } from './shared/places/province-city.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './shared/auth_interceptor.service';
import { AuthGuard } from './shared/auth/auth.guard';


const appRoutes: Routes = [
{path : '', component: HomeComponent},
{path : 'home', component: HomeComponent},
{path : 'registration', component: RegistrationComponent},
{path : 'login', component: LoginComponent},
{path : 'contact_Us', component: ContactUsComponent},
{path : 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},

] ;

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    ContactUsComponent,
    HomeComponent,
    DashboardComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ApiRequestService, ProvinceCityService,AuthGuard, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
