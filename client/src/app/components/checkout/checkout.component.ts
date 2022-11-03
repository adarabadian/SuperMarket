import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { Toast } from 'ngx-toastr';
import { OrderDetails } from 'src/app/models/OrderDetails';
import { CartService } from 'src/app/services/cart.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

// declare var jsPDF: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  public deliveryFormGroup: FormGroup;

  public city: FormControl;
  public street: FormControl;
  public deliveryDate: FormControl;
  public creditCard: FormControl;

  public minDate: Date;
  public isDeliveryDateValid: boolean;

  public search: string;


  @ViewChild('tableToSave') tableToSave: ElementRef;

  constructor(public cartService: CartService, private userService: UserService, private router: Router, private ordersService: OrdersService) { }

  ngOnInit(): void {
    if (this.cartService.userCart.size == 0) {
      this.router.navigate(["/customer"]);
    }

    this.setMinimumDate();

    this.search = "";

    this.city = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(15)]);
    this.street = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern("^[a-zA-Z\s\u05D0-\u05EA'0-9_ \s]*$")]);
    this.deliveryDate = new FormControl("", [Validators.required]);
    this.creditCard = new FormControl("", [Validators.required, Validators.min(10000000), Validators.max(99999999999999999999)]);

    this.deliveryFormGroup = new FormGroup({
      city: this.city,
      street: this.street,
      deliveryDate: this.deliveryDate,
      creditCard: this.creditCard
    });

    this.getUserAddress();
  }

  // set minimum date for date input
  private setMinimumDate() {
    this.minDate = new Date();

    // minimum date is one at least from tomorrow
    this.minDate.setDate(this.minDate.getDate() + 1);

    // remove hours from date 
    this.minDate.setHours(0, 0, 0, 0);
  }

  // get user address from server to set its value as default address value on checkout screen
  private getUserAddress(): void {
    const observable = this.userService.getUserAddress();

    observable.subscribe(successfulServerRequestData => {
      // set the values gotten from server
      this.city.setValue(successfulServerRequestData.City);
      this.street.setValue(successfulServerRequestData.Street);
    }, serverErrorResponse => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: serverErrorResponse.error.error
      });
    })
  }

  public validateDate(): void {
    let delDate = new Date(this.deliveryDate.value).getTime();
    let minDate = this.minDate.getTime();

    // if delivery date is not before tomorrow then set delivery date as false,
    // if its false then user won't be able to continue
    if (minDate >= delDate) {
      this.isDeliveryDateValid = false;
      return;
    }

    this.isDeliveryDateValid = true;
  }

  // function that sums all prices to show on checkout component below the table
  public calculateCart(): string {
    let totalCartPrice = 0;

    // sum all products prices
    this.cartService.userCart.forEach((values: any, keys) => {
      totalCartPrice = totalCartPrice + (values.price * values.amount)
    });

    let priceToShow = totalCartPrice.toFixed(2);
    return priceToShow;
  }

  // return to previous page
  public returnToProducts() {
    this.router.navigate(["/customer"]);
  }

  // checkout function
  public checkout() {
    // set object to send to server
    let deliveryDetails = new OrderDetails(this.city.value, this.street.value, this.deliveryDate.value, this.creditCard.value);

    const observable = this.ordersService.order(deliveryDetails);
    observable.subscribe(successfulServerRequestData => {
      // download invoice as pdf for user
      this.downloadInvoice();

      // empty the user cart's
      this.cartService.userCart = new Map();

      // move to next page
      this.router.navigate(["/checkout-complete"]);
    },
      serverErrorResponse => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: serverErrorResponse.error.error
        });
      })
  }

  private async downloadInvoice(): Promise<void> {
    // set doc as PDF page
    let doc = new jsPDF("p", "mm", "a4");

    // add the header for the doc, when the response returns it will replace the doc
    doc = this.addPdfHeader(doc);

    // add the body for the doc, when the response returns it will replace the doc
    let addBodyFunctionResult = this.addPdfBody(doc);

    // set the doc as the first index of the result of the last row
    doc = addBodyFunctionResult[0];

    // set the row height to continue from as the second index of the result of the last row
    let lastRowHeight = addBodyFunctionResult[1];

    // add the logo and footer for the doc, when the response returns it will replace the doc
    doc = this.addLogoToPdf(doc, lastRowHeight);

    // download the final pdf
    doc = doc.save('AdarMarket - Invoice.pdf');
  }

  private addPdfHeader(doc) {
    doc.text('AdarMarket - Invoice', 80, 20);

    // format the order date before adding it 
    let today: any = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    // add the bill to + name to top left
    doc.text("Bill To: " + this.userService.firstName, 5, 10);

    // add the date to top left
    doc.text(today, 175, 10);

    // the table headers
    doc.text('Name', 10, 40);
    doc.text('Price', 65, 40);
    doc.text('Amount', 120, 40);
    doc.text('Total Price', 175, 40);

    // return the updated doc
    return doc;
  }

  // add body to pdf, returns the position of the last row that it stopped in and the updated doc
  addPdfBody(doc) {
    let rowHeight = 50;
    let totalPurchasePrice = 0;

    // for each product print a row
    this.cartService.userCart.forEach(product => {
      // create horizontal line
      doc.line(5, rowHeight - 8, 205, rowHeight - 8);

      doc.text(product.name, 10, rowHeight);
      doc.text((+product.price).toFixed(2) + " NIS", 65, rowHeight);
      doc.text(product.amount + "", 120, rowHeight);
      doc.text((product.price * product.amount).toFixed(2) + " NIS", 175, rowHeight);

      // while looping through products get total price
      totalPurchasePrice = totalPurchasePrice + +product.price * product.amount;

      // increase row height
      rowHeight = rowHeight + 10;

      // if row is too low it will be cut so open a new page
      if (rowHeight + 55 >= doc.internal.pageSize.height) {
        doc.addPage();
        rowHeight = 7 // Restart height position
      }
    });

    // add Total Purchase Price
    doc.text('Total Purchase Price: ' + totalPurchasePrice.toFixed(2) + ' NIS', 68, rowHeight + 5);

    // need to return both row height for image and the doc because the function changed it
    return [doc, rowHeight]
  }

  private addLogoToPdf(doc, rowHeight) {
    const logo = new Image();

    logo.src = 'assets/logo.png';

    // add the thanks message on bottom
    doc.text('Thanks for buying from us!', 75, rowHeight + 20);

    // add the image on bottom
    doc.addImage(logo, 'png', 45, rowHeight + 25, 125, 50);

    // return the updated doc
    return doc;
  }
}
