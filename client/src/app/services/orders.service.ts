import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  public isShowFirstOrderMessage(): Observable<boolean> {
    return this.http.get<boolean>("https://adar-market.herokuapp.com/orders/isFirstOrder");
  }

  
  public getOrdersAmount(): Observable<number> {
    return this.http.get<number>("https://adar-market.herokuapp.com/orders/getOrdersAmount");
  }
  
  
  public order(deliveryDetails): Observable<any> {
    return this.http.post<any>("https://adar-market.herokuapp.com/orders", deliveryDetails);
  }
}
