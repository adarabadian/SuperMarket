import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { AdminComponent } from '../components/admin/admin.component';
import { SharedModule } from './shared.module';
import { CommonModule } from '@angular/common';
import { AdminProductModalComponent } from '../components/admin-product-modal/admin-product-modal.component';
import { BrowserModule } from '@angular/platform-browser';


const routes: Routes = [{ 
    path: "" ,component: AdminComponent,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],

  declarations: [ 
    AdminComponent, 
    AdminProductModalComponent,
  ],
})

export class AdminModule {
 }