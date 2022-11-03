import { Component, Input, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})

export class AllProductsComponent implements OnInit {
  public filter: string;

  @Input()
  search: string;

  @Input()
  userType: string;

  constructor(public productService: ProductsService) { }

  ngOnInit(): void {
    this.getAllProducts();
    this.filter = "";
  }

  // get all products function
  private getAllProducts(): void {
    // if already have all products just return
    if (this.productService.allProducts == []) {
      return;
    }

    const observable = this.productService.getAllProducts();

    observable.subscribe(successfulServerRequestData => {
      // set all products from server response
      this.productService.allProducts = successfulServerRequestData;
    }, serverErrorResponse => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: serverErrorResponse.error.error
      });
    })
  }

  public getFilterValue(filterSentFromChild: string) {
    this.filter = filterSentFromChild;
  }

}
