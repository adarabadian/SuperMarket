import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginDetails } from 'src/app/models/UserLoginDetails';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public userLoginDetails: UserLoginDetails;

  public userDetailsForm: FormGroup;

  public email: FormControl;
  public password: FormControl;

  public productsAmount: number;
  public ordersAmount: number;

  constructor(
    private router: Router,
    private userService: UserService,
    private productsService: ProductsService,
    private ordersService: OrdersService,
  ) {
  }

  ngOnInit(): void {
    this.userLoginDetails = new UserLoginDetails();

    this.productsAmount = 0;
    this.ordersAmount = 0;

    this.email = new FormControl("", [Validators.required, Validators.email]);
    this.password = new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(12)]);

    this.userDetailsForm = new FormGroup({
      email: this.email,
      password: this.password
    });

    this.getOrdersAmount();
    this.getProductsAmount();
    this.autoLogin();
  }

  // get products amount to show to everyone
  public getProductsAmount(): void {
    const observable = this.productsService.getProductsAmount();

    observable.subscribe(successfulServerRequestData => {
      // get the count ID parameter and set it as product amount
      this.productsAmount = successfulServerRequestData["COUNT(ID)"];
    }, serverErrorResponse => {console.log(serverErrorResponse.error.error);
    });
  }

  // get orders amount from server to show to everyone on login screen
  public getOrdersAmount(): void {
    const observable = this.ordersService.getOrdersAmount();

    observable.subscribe(successfulServerRequestData => {
      // get the count ID parameter and set it as orders amount
      this.ordersAmount = successfulServerRequestData["COUNT(ID)"];
    }, serverErrorResponse => 
      {console.log(serverErrorResponse.error.error);
    })
  }

  // login function
  public login(): void {
    this.userLoginDetails.email = this.email.value
    this.userLoginDetails.password = this.password.value;

    const observable = this.userService.login(this.userLoginDetails);

    observable.subscribe(successfulServerRequestData => {
      // set parameters from login response
      localStorage.setItem("token", successfulServerRequestData.token + "");
      localStorage.setItem("marketFirstName", successfulServerRequestData.firstName + "");
      localStorage.setItem("userType", successfulServerRequestData.userType + "");
      this.userService.firstName = successfulServerRequestData.firstName;

      // if user is admin move to admin , else move to customer
      if (successfulServerRequestData.userType == "CUSTOMER") {
        this.router.navigate(["/customer"]);
      }
      if (successfulServerRequestData.userType == "ADMIN") {
        this.router.navigate(["/admin"]);
      }
    }, serverErrorResponse => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: serverErrorResponse.error.error
      })
    })
  }

  // auto login function
  public autoLogin(): void {
    // try to login user automaticly when he enters the site
    let token = localStorage.getItem("token");

    if (token == null || token == "undefined") {
      this.router.navigate(["/login"]);
    }
    // if token is exists then try to log in
    else {
      this.loginWithToken(token);
    }
  }

  // login function with token
  public loginWithToken(token): void {
    const observable = this.userService.loginWithToken(token);
    observable.subscribe(successfulServerRequestData => {
      if (successfulServerRequestData.userType == null || successfulServerRequestData.userType == "undefined"){
        return;
      }
      localStorage.setItem("userType", successfulServerRequestData.userType + "");
      localStorage.setItem("marketFirstName", successfulServerRequestData.firstName + "");
      this.userService.firstName = successfulServerRequestData.firstName;

      if (successfulServerRequestData.userType == "CUSTOMER") {
        this.router.navigate(["/customer"]);
      }

      if (successfulServerRequestData.userType == "ADMIN") {
        this.router.navigate(["/admin"]);
      }
    }, serverErrorResponse => {
    })
  }

  public moveToRegister(): void {
    this.router.navigate(["/register"]);
  }
}
