import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRegisterDetails } from 'src/app/models/UserRegisterDetails';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  public userDetailsForm: FormGroup;

  public id: FormControl;
  public email: FormControl;
  public password: FormControl;
  public passwordVerification: FormControl;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.id = new FormControl("", [Validators.required, Validators.min(10000000), Validators.max(999999999)]);
    this.email = new FormControl("", [Validators.required, Validators.email]);
    this.password = new FormControl("", [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,}'),
    Validators.minLength(6), Validators.maxLength(12)]);
    this.passwordVerification = new FormControl("", [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,}'),
    Validators.minLength(6), Validators.maxLength(12)]);

    this.userDetailsForm = new FormGroup({
      id: this.id,
      email: this.email,
      password: this.password,
      passwordVerification: this.passwordVerification
    });
  }

  // redirect function
  public backToLogin(): void {
    this.router.navigate(["/login"]);
  }

  // move to next register page
  public next(): void {
    // update the object that will proceed to the next page
    this.userService.userRegisterDetails.id = this.id.value;
    this.userService.userRegisterDetails.email = this.email.value;
    this.userService.userRegisterDetails.password = this.password.value;
    this.userService.userRegisterDetails.passwordVerification = this.passwordVerification.value;

    const observable = this.userService.isUserExists(this.id.value, this.email.value);

    observable.subscribe(successfulServerRequestData => {
      // if user isn't exists redirect to advanced register (register's second page)
      this.router.navigate(["/advanced-register"]);
    }, serverErrorResponse => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: serverErrorResponse.error.error
      })
    })
  }

}
