import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/models/Product';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent implements OnInit {
  public product : Product;
  public productCardComponent : any;
  public userType : string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog ) { }

  ngOnInit(): void {
    this.product = this.data.product; 
    this.productCardComponent = this.data.productCardComponent; 
    this.userType = this.data.productCardComponent.userType; 
  }

  closeModal():void{
    this.dialog.closeAll();
  }

  public addToCart():void{
    // this function receives the prodCartComponent and executes functions from it
    this.productCardComponent.addToCart(this.product);
    this.closeModal();
  }
}
