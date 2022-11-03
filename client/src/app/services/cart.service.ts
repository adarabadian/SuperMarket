import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CartItem } from '../models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public userCart :Map<number, CartItem>;
  
  constructor(private http: HttpClient) { 
    this.userCart = new Map();
  }

    
  public getUserCart(): Observable<[]> {
    return this.http.get<[]>("https://adarmarket.onrender.com/cart");
  }

  public createNewCart(): Observable<any> {
    // happens in register when user have no cart / user just made an order
    return this.http.post<any>("https://adarmarket.onrender.com/cart/createNewCart",{});
  }


  public addProductToCart(productId, productAmount):Observable <any>{
    let productToAdd = {
      "productId": productId,
      "productAmount" : productAmount
    }

    return this.http.post<any>("https://adarmarket.onrender.com/cart", productToAdd);
  }

  public deleteProductFromCart(productId):Observable <any>{
    return this.http.delete<any>("https://adarmarket.onrender.com/cart/" + productId);
  }
  
  public emptyUserCart():Observable <any>{
    return this.http.delete<any>("https://adarmarket.onrender.com/cart/emptyUserCart");
  }
  

  public updateProductAmount(productId, productAmount):Observable <any>{
    let productToUpdate = {
      "productId": productId,
      "productAmount" : productAmount
    }
    
    return this.http.put<any>("https://adarmarket.onrender.com/cart/updateProductAmount", productToUpdate);
  }
  

}
