import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page404-component',
  templateUrl: './page404-component.component.html',
  styleUrls: ['./page404-component.component.css']
})
export class Page404Component implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  public redirectUser(): void{
    // navigate user to login , if he has token he will be logged in automaticly
    this.router.navigate(["/login"]);
  }
}
