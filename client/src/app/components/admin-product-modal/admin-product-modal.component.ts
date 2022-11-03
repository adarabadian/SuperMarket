import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/Product';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-product-modal',
  templateUrl: './admin-product-modal.component.html',
  styleUrls: ['./admin-product-modal.component.css']
})
export class AdminProductModalComponent implements OnInit {
  public adminProductForm: FormGroup;

  public productName: FormControl;
  public productCategory: FormControl;
  public productPrice: FormControl;
  public productPicture: any;

  public categories: any;

  public imagePreviewUrl: string;

  public defaultProductCategory: any;

  constructor(@Inject(MAT_DIALOG_DATA) public product: any, private productsService: ProductsService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.product = this.product.product;
    this.categories = [];
    this.productPicture = "";

    this.defaultProductCategory = "";

    this.getAllProductCategories();

    this.productName = new FormControl(this.product.name, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
    this.productCategory = new FormControl('', [Validators.required, Validators.min(1)]);
    this.productPrice = new FormControl(this.product.price, [Validators.required, Validators.min(0.1)])
    this.adminProductForm = new FormGroup({
      name: this.productName,
      category: this.productCategory,
      price: this.productPrice
    });

    this.imagePreviewUrl = "";
  }

  closeModal(): void {
    this.dialog.closeAll();
  }


  public saveProduct() {
    let productToUpload: Product = {
      name: this.productName.value,
      category: +this.productCategory.value,
      price: +this.productPrice.value,
    }

    // if user didnt uploaded an image
    if (this.productPicture == "") {
      productToUpload.picture = this.product.picture;

      // if he is adding new product
      if (this.product.id > 0) {
        productToUpload.id = this.product.id;
        this.updateProduct(productToUpload);
        return;
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You forgot to upload picture!'
      })
    }
    else {
      productToUpload.picture = this.uploadPictureToServer(productToUpload);
    }
  }

  // this adds decimal point
  public fixNumberDecimals(event): void {
    this.productPrice.setValue = event.target.valueAsNumber.toFixed(2);
  }

  // add product function
  private addProduct(productToUpload: Product): void {
    const observable = this.productsService.addNewProduct(productToUpload);

    observable.subscribe(newProductId => {
      // get category name instead of id to save on client
      productToUpload.category = this.categories.find(category => category.ID == productToUpload.category).Name;

      // need to receive id because admin may want to edit the product immediately after uploading it
      productToUpload.id = newProductId;

      // this adds decimal point
      productToUpload.price = parseFloat(productToUpload.price).toFixed(2);

      // push to Array, without the slice the component wont refresh
      this.productsService.allProducts.push(productToUpload);
      this.productsService.allProducts = this.productsService.allProducts.slice();

      this.closeModal();
      this.alertSuccess(productToUpload.name, " was added successfuly!");
    },
      serverErrorResponse => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: serverErrorResponse.error.error
        })
      });
  }

  private updateProduct(productToUpload: Product) {
    const observable = this.productsService.updateProduct(productToUpload);

    observable.subscribe(successfulServerRequestData => {
      // replace original product's name
      this.product.name = productToUpload.name;

      // get category name instead of id to save on client
      this.product.category = this.categories.find(category => category.ID == productToUpload.category).Name;

      this.product.price = productToUpload.price.toFixed(2);

      // if image has changed save the new one
      if (this.imagePreviewUrl.length > 0) {
        this.product.picture = this.imagePreviewUrl;
      }

      this.alertSuccess(productToUpload.name, " was updated successfuly!");
    }, serverErrorResponse => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: serverErrorResponse.error.error
      })
    })
  }

  // upload picture (using multer)
  private uploadPictureToServer(productToUpload) {
    let data = new FormData();

    // if theres a file exists attach it to the data to delete it from server
    if (this.product.picture != undefined) {
      data.append('fileToDelete', this.product.picture);
    }

    // attach the image to data
    data.append('file', this.productPicture);

    const observable = this.productsService.uploadPictureToServer(data);

    observable.subscribe(multerResponse => {
      // set the new picture as the response.filename gotten from server
      productToUpload.picture = multerResponse.filename;

      if (this.product.id > 0) {
        productToUpload.id = this.product.id;
        this.updateProduct(productToUpload);
        return;
      }

      // callback for add product to save it
      this.addProduct(productToUpload);
    }, serverErrorResponse => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: serverErrorResponse.error.error
      })
    })
  }

  // get all categories for select list, this is a request instead of hard coded array because categories may change 
  private getAllProductCategories(): void {
    const observable = this.productsService.getAllProductCategories();

    observable.subscribe(categoriesResult => {
      // set the categories variable of the class 
      this.categories = categoriesResult;

      // if productId is 0 then its a new product so no need for default category
      if (this.product.id == 0) {
        return
      }

      // set default product category
      this.defaultProductCategory = categoriesResult.find(category => category.Name == this.product.category);
      this.productCategory.setValue(this.defaultProductCategory.ID);

    }, serverErrorResponse => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: serverErrorResponse.error.error
      })
    })
  }

  // show success message
  private alertSuccess(productName, message) {
    Swal.fire({
      icon: 'success',
      title: 'SUCCESS!',
      text: productName + message,
    });

    this.closeModal();
  };

  // this function is used to set imagePreviewUrl variable as the picture that was uploaded from the client
  onPictureAdd(event: any): void {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.imagePreviewUrl = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
      this.productPicture = event.target.files[0];
    }
  }
}
