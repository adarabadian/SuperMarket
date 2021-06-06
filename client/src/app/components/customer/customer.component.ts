import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  public filter: string;
  public search: string;
  public isFirstOrder: boolean;

  constructor(private cartService: CartService, private ordersService: OrdersService, public userService: UserService) { }

  ngOnInit(): void {
    this.filter = "";
    this.search = "";
    this.isFirstOrder = false;
    this.userService.userType = "CUSTOMER";

    this.isShowFirstOrderMessage();
    this.getUserCart();
  }

  // public changeProductPipe(filter):void{
  //   this.filter = filter;
  // }


  private getUserCart(): void {
    if (this.cartService.userCart.size == 0) {
      const observable = this.cartService.getUserCart();

      observable.subscribe(successfulServerRequestData => {
        if (successfulServerRequestData.length > 0) {
          this.promptOldCartDialog(successfulServerRequestData);
        }
      }, serverErrorResponse => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: serverErrorResponse.error.error
        });
      })
    }
  }

  private promptOldCartDialog(successfulServerRequestData) {
    Swal.fire({
      title: 'Hey, i found an old cart that belongs to you!',
      text: "Do you want to use the old cart or open a new one?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Open new cart',
      confirmButtonText: 'Restore old cart',
    }).then((result) => {
      if (result.isConfirmed) {
        this.setUserCartFromServerResponse(successfulServerRequestData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your cart was restored successfuly',
          timer: 1500
        }
        );
      }
      else {
        this.emptyUserCart();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your cart was deleted successfuly',
          timer: 1500
        }
        );
      }
    })
  }

  private setUserCartFromServerResponse(successfulServerRequestData): void {
    successfulServerRequestData.forEach(product => {
      this.cartService.userCart.set(product.productId, {
        id: product.productId,
        price: product.price,
        amount: product.amount,
        name: product.name,
        totalPrice: product.totalPrice,
        picture: product.picture
      });
    });
  }

  public isShowFirstOrderMessage(): void {
    // if user came back from checkout screen the message when pop because cart isnt empty
    if (this.cartService.userCart.size == 0) {
      const observable = this.ordersService.isShowFirstOrderMessage();

      observable.subscribe(successfulServerRequestData => {
        this.isFirstOrder = successfulServerRequestData;
      },
        serverErrorResponse => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: serverErrorResponse.error.error
          })
        })
    }
  }

  private emptyUserCart(): void {
    const observable = this.cartService.emptyUserCart();

    observable.subscribe(successfulServerRequestData => {
      this.cartService.userCart = new Map();
    },
      serverErrorResponse => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: serverErrorResponse.error.error
        })
      })
  };

  public closeFirstOrderModal() {
    this.isFirstOrder = false;
  }
}
