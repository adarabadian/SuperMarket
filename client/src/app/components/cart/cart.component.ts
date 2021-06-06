import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public isCollapsed: boolean;
  public cartBtnText: string;
  public currentWindowWidth: number;
  public isCartEnabled: boolean;

  constructor(public cartService: CartService, public router: Router) { }

  ngOnInit(): void {
    this.isCollapsed = true;
    this.cartBtnText = "Open Cart";
    this.calculateCart();
  }

  public toggleCart(): void {
    // should be available only from customer
    if (this.router.url != '/customer') {
      return;
    }

    // switch isCollapsed state
    this.isCollapsed = !this.isCollapsed;

    // set button text
    if (this.isCollapsed) {
      this.cartBtnText = "Open Cart";
    }
    else {
      this.cartBtnText = "Close Cart";
    }
  }

  // empty user cart
  public emptyUserCart(): void {
    const observable = this.cartService.emptyUserCart();
    observable.subscribe(successfulServerRequestData => {
      // set user cart as new user cart after the server succeeded emptying the user's cart
      this.cartService.userCart = new Map();

      // close cart modal
      this.toggleCart();
    },
      serverErrorResponse => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: serverErrorResponse.error.error
        });
      })
  }

  public checkout(): void {
    // if cart is empty then dont checkout, just show err message and return
    if (this.cartService.userCart.size == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops... your cart is empty!',
        text: 'Please fill your cart first'
      })
      return;
    }

    // close cartModal
    this.toggleCart();

    // move to checkout page
    this.router.navigate(["/checkout"]);
  }

  // calculate cart is used to show total price on cart
  public calculateCart(): string {
    let totalCartPrice = 0;

    // sum all products
    this.cartService.userCart.forEach((values: any, keys) => {
      totalCartPrice = totalCartPrice + (values.price * values.amount)
    });

    // add 2 decimals 
    let priceToShow = totalCartPrice.toFixed(2);

    // return the result
    return priceToShow;
  }

  // remove the product from user cart map on client and from db
  public deleteProduct(key): void {
    const observable = this.cartService.deleteProductFromCart(key);

    observable.subscribe(successfulServerRequestData => {
      // remove the key of the product from user cart (type map)
      this.cartService.userCart.delete(key);
    }, serverErrorResponse => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: serverErrorResponse.error.error
      });
    });
  }

  // after user changed the product's amount update it accordingly 
  public updateItemAmount(event: any, id: number) {
    let amountInputValue = event.target.value;
    this.cartService.userCart.get(id).amount = amountInputValue;

    // if the product is empty or 0 just delete it from cart
    if (amountInputValue == 0) {
      this.deleteProduct(id);
      return;
    }

    // update the amount on server
    const observable = this.cartService.updateProductAmount(id, amountInputValue);
    observable.subscribe(successfulServerRequestData => {
    }, serverErrorResponse => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: serverErrorResponse.error.error
      });
    });
  }
}
