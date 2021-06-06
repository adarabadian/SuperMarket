import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/Product';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { AdminProductModalComponent } from '../admin-product-modal/admin-product-modal.component';
import { ProductModalComponent } from '../product-modal/product-modal.component';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input()
  product : Product;

  @Input()
  userType : string;

  constructor(private cartService: CartService, public userService : UserService, public dialog: MatDialog ) { }

  ngOnInit(): void {
  }

  public addToCart(product):void{
    let productToAdd= {
      id: product.id,
      name: product.name,
      price: product.price, 
      amount:0,
      picture:product.picture
    }

    // if this product is already in cart
    if (this.cartService.userCart.has(product.id)){
      productToAdd.amount = this.cartService.userCart.get(product.id).amount + 1;
      
      const observable = this.cartService.updateProductAmount(productToAdd.id, productToAdd.amount);
      observable.subscribe(successfulServerRequestData => {
        this.cartService.userCart.set(productToAdd.id, productToAdd);
      }, serverErrorResponse => {    
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: serverErrorResponse.error.error
        });
      });
    }
    else{
      productToAdd.amount = 1;
      const observable = this.cartService.addProductToCart(productToAdd.id, productToAdd.amount);

      observable.subscribe(successfulServerRequestData => {
        this.cartService.userCart.set(productToAdd.id, productToAdd);
      }, serverErrorResponse => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: serverErrorResponse.error.error
        })
      });
    }
    Swal.fire({
      position: 'top-start',
      icon: 'success',
      title: productToAdd.name + ' was added to cart\n Current '+ productToAdd.name + "s amount is " + productToAdd.amount,
      showConfirmButton: false,
      timer: 1500
    })
  }

  public openProductModal (): void{
    this.dialog.open(ProductModalComponent, {
      data: { product: this.product , productCardComponent: this},
    });
  }

  public openEditProductModal (): void{
    this.dialog.open(AdminProductModalComponent, {
      data: { product: this.product},
    });
  }

}
