import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginDetails } from 'src/app/models/UserLoginDetails';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-advanced-register',
  templateUrl: './advanced-register.component.html',
  styleUrls: ['./advanced-register.component.css']
})
export class AdvancedRegisterComponent implements OnInit {
  public userDetailsForm: FormGroup;

  public street: FormControl;
  public firstName: FormControl;
  public lastName: FormControl;
  public city: FormControl;

  public citys: string[];


  constructor(private router: Router, public userService: UserService, private cartService: CartService) { }

  ngOnInit(): void {
    // just check that user didnt get here without filling some fields from the first register page
    if (this.userService.userRegisterDetails.password == undefined || this.userService.userRegisterDetails.password == "") {
      this.router.navigate(["/register"]);
    }

    // set citys array
    this.citys = [
      "Tel Aviv",
      "Jerusalem",
      "Azor",
      "Haifa",
      "Holon",
      "Beer Sheva",
      "Eliat",
      "Ramat Gan",
      "Dimona",
      "Kfar Saba"
    ];

    this.city = new FormControl("", [Validators.required]);
    this.street = new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(20)]);
    this.firstName = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(12), Validators.pattern("^[a-zA-Z'0-9_ \s]*$")]);
    this.lastName = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(12), Validators.pattern("^[a-zA-Z'0-9_ \s]*$")])
    this.userDetailsForm = new FormGroup({
      city: this.city,
      street: this.street,
      firstName: this.firstName,
      lastName: this.lastName
    });
  }

  // used for back button 
  public previousRegister(): void {
    this.router.navigate(["/register"]);
  }

  // register function
  public register(): void {
    // set details 
    this.userService.userRegisterDetails.city = this.city.value;
    this.userService.userRegisterDetails.street = this.street.value;
    this.userService.userRegisterDetails.firstName = this.firstName.value;
    this.userService.userRegisterDetails.lastName = this.lastName.value;

    const observable = this.userService.register(this.userService.userRegisterDetails);

    observable.subscribe(successfulServerRequestData => {
      // set data gotten on localStorage
      localStorage.setItem("marketFirstName", successfulServerRequestData.firstName + "");
      localStorage.setItem("token", successfulServerRequestData.token + "");
      this.userService.firstName = successfulServerRequestData.firstName;

      // new user needs new cart, so create cart function
      this.createNewCart();
    },
      serverErrorResponse => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: serverErrorResponse.error.error
        })
      })
  };

  public createNewCart(): void {
    const observable = this.cartService.createNewCart();

    observable.subscribe(successfulServerRequestData => {
      // after successfull cart added response, move to main customer page
      this.router.navigate(["/customer"]);
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
