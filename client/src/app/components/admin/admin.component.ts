import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  public search:string;

  constructor(public userService: UserService) {
   }

  ngOnInit(): void {
    this.search = "";
    this.userService.userType = "ADMIN";
  }
  

}
