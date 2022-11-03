import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuccessfulLoginServerResponse } from '../models/SuccessfulLoginServerResponse';
import { UserLoginDetails } from '../models/UserLoginDetails';
import { UserRegisterDetails } from '../models/UserRegisterDetails';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userRegisterDetails: UserRegisterDetails;
  public firstName: string;
  public userType: string;

  constructor(private http : HttpClient) { 
    this.userRegisterDetails = new UserRegisterDetails();
    this.firstName = "Guest";
    this.userType = "";
   }

  public register(userRegisterDetails: UserRegisterDetails): Observable<SuccessfulLoginServerResponse> {
    return this.http.post<SuccessfulLoginServerResponse>("https://adarmarket.onrender.com/users", userRegisterDetails);
    }

  public login(userLoginDetails: UserLoginDetails):Observable <SuccessfulLoginServerResponse>{
    return this.http.post<SuccessfulLoginServerResponse>("https://adarmarket.onrender.com/users/login", userLoginDetails);
  }

  public isUserExists(id: number, email: string):Observable <SuccessfulLoginServerResponse>{
    let userDetails = {id: id, email: email}
    return this.http.post<SuccessfulLoginServerResponse>("https://adarmarket.onrender.com/users/isUserExists", userDetails);
  }

  public logOutUser():Observable <any>{
    return this.http.post<SuccessfulLoginServerResponse>("https://adarmarket.onrender.com/users/logOutUser", {});
  }

  public loginWithToken(token):Observable<SuccessfulLoginServerResponse>{
    return this.http.post<SuccessfulLoginServerResponse>("https://adarmarket.onrender.com/users/logUserWithToken", {"token": token});
  }

  public getUserAddress(): Observable<any> {
    return this.http.get<any>("https://adarmarket.onrender.com/users/getUserAddress");
  }
  
}
