import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllProductsComponent } from '../components/all-products/all-products.component';
import { CategoryPipe } from '../pipes/CategoryPipe';
import { SearchPipe } from '../pipes/SearchPipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CategoriesListComponent } from '../components/categories-list/categories-list.component';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
    declarations: [ 
      AllProductsComponent,
      CategoryPipe,
      SearchPipe,
      ProductCardComponent,
      CategoriesListComponent,
    ],
    
    imports: [
      CommonModule,
      FormsModule,
      MatDialogModule,
      ReactiveFormsModule,
      MatExpansionModule,
      SweetAlert2Module.forRoot(), // SweetAlert2Module added
    ],

    exports:[
      ProductCardComponent,
      AllProductsComponent,
      CategoryPipe,
      SearchPipe,
      FormsModule,
      ReactiveFormsModule,
      MatDialogModule,
      CommonModule,
      CategoriesListComponent,
      MatExpansionModule,
    ]
  })

export class SharedModule {
 }