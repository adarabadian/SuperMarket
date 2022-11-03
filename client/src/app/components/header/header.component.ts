import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { AdminProductModalComponent } from '../admin-product-modal/admin-product-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(public userService: UserService, private cartService: CartService, public router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUserFirstName();
  }

  public openNewModelProduct(): void {
    // set empty product
    this.dialog.open(AdminProductModalComponent, {
      data: { product: new Product(0, "", undefined, 0, '/assets/noPicture.png') },
    });
  }


  // get username to show on header
  public getUserFirstName(): void {
    let userName = localStorage.getItem("marketFirstName");
    this.userService.firstName = userName;
  }

  // log user out
  public logOut = async () => {
    const observable = this.userService.logOutUser();

    observable.subscribe(successfulServerRequestData => {
      // clear session storage so he wont have useless data and wont be able to login until he relogs
      localStorage.clear();

      this.emptyUserCartOnLogout();

      this.userService.firstName = "Guest";

      // move to login page
      this.router.navigate(["/login"]);
    }, serverErrorResponse => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: serverErrorResponse.error.error
      });
    })
  }

  private emptyUserCartOnLogout = () => {
    // emmpty user cart
    this.cartService.userCart = new Map();
  }
}
