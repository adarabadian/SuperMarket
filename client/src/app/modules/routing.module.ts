import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { AdvancedRegisterComponent } from '../components/advanced-register/advanced-register.component';
import { CustomerComponent } from '../components/customer/customer.component';
import { Page404Component } from '../components/page404-component/page404-component.component';
import { AdminComponent } from '../components/admin/admin.component';
import { AllProductsComponent } from '../components/all-products/all-products.component';
import { CustomerGuard } from '../guards/customer.guard';
import { CheckoutComponent } from '../components/checkout/checkout.component';
import { CheckoutCompleteComponent } from '../components/checkout-complete/checkout-complete.component';
import { AdminGuard } from '../guards/admin.guard';
import { AdminModule } from './admin.module';

const routes: Routes = [
  { path: "admin",  canActivate:[ AdminGuard ], loadChildren: './admin.module#AdminModule'},
  { path: "login", component: LoginComponent },
  { path: "allproducts", component: AllProductsComponent },
  { path: "customer",  canActivate:[CustomerGuard], component: CustomerComponent },
  { path: "checkout",  canActivate:[CustomerGuard], component: CheckoutComponent },
  { path: "checkout-complete",  canActivate:[CustomerGuard], component: CheckoutCompleteComponent },
  { path: "register", component: RegisterComponent },
  { path: "advanced-register", component: AdvancedRegisterComponent },

  {path: "", redirectTo: "login", pathMatch: "full" },


  { path: "**", component: Page404Component }
];

@NgModule({
    declarations: [
      
    ],
    imports: [
      CommonModule,
      RouterModule.forRoot(routes) // Importing the above routes
    ],
    exports: [
      RouterModule
    ]
  })

export class RoutingModule {

 }
