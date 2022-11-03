import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  public isShowFirstOrderMessage(): Observable<boolean> {
    return this.http.get<boolean>("https://adarmarket.onrender.com/orders/isFirstOrder");
  }

  
  public getOrdersAmount(): Observable<number> {
    return this.http.get<number>("https://adarmarket.onrender.com/orders/getOrdersAmount");
  }
  
  
  public order(deliveryDetails): Observable<any> {
    return this.http.post<any>("https://adarmarket.onrender.com/orders", deliveryDetails);
  }
    

  public sendInvoiceEmail(doc): Observable<any> {
    return this.http.post<any>("https://adarmarket.onrender.com/orders/sendInvoiceEmail", doc);
  }
}
