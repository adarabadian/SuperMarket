import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  public allProducts : Product[];
  public filterByCategory: string;
   
  constructor(private http: HttpClient) {
    this.allProducts = [];
   }

  
  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>("https://adar-market.herokuapp.com/products");
  }
  
  public getProductsAmount(): Observable<number> {
    return this.http.get<number>("https://adar-market.herokuapp.com/products/getProductsAmount");
  }

  public getAllProductCategories(): Observable<any> {
    return this.http.get<any>("https://adar-market.herokuapp.com/products/getAllCategories");
  }
  
  public addNewProduct(productToUpload: Product): Observable<any> {
    return this.http.post<any>("https://adar-market.herokuapp.com/products/", productToUpload);
  }
    
  public updateProduct(productToUpload: Product): Observable<any> {
    return this.http.put<any>("https://adar-market.herokuapp.com/products/", productToUpload);
  }   

  public uploadPictureToServer(data): Observable<any> {
    return this.http.post<any>("https://adar-market.herokuapp.com/products/uploadPicture", data, {});
  }

}
