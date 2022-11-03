import { NgModule } from '@angular/core';
import { LayoutComponent } from '../components/layout/layout.component';
import { HeaderComponent } from '../components/header/header.component';
import { RoutingModule } from './routing.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from '../components/register/register.component';
import { LoginComponent } from '../components/login/login.component';
import { AdvancedRegisterComponent } from '../components/advanced-register/advanced-register.component';
import { CustomerComponent } from '../components/customer/customer.component';
import { Page404Component } from '../components/page404-component/page404-component.component';
import { AuthenticationInterceptor } from '../interceptors/AuthenticationInterceptor';
import { SharedModule } from './shared.module';
import { CartComponent } from '../components/cart/cart.component';
import { CheckoutComponent } from '../components/checkout/checkout.component';
import { CheckoutCompleteComponent } from '../components/checkout-complete/checkout-complete.component';
import { ProductModalComponent } from '../components/product-modal/product-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AdvancedRegisterComponent,
    LayoutComponent,
    HeaderComponent,
    CustomerComponent,
    Page404Component,
    CartComponent,
    CheckoutComponent,
    CheckoutCompleteComponent,
    ProductModalComponent,
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    RouterModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // Customer didnt got his own module because he is probably going to log in to "CUSTMER" account anyway
    // for img gallery
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }
  ],
  bootstrap: [LayoutComponent],
  
})
export class AppModule { }
