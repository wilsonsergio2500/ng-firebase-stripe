import { Component, AfterContentInit, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentMethod } from '@stripe/stripe-js';

export interface IPaymentMethodsDialogDataParams {
  options: PaymentMethod[],
  preferred: PaymentMethod
}

@Component({
    selector: 'mat-commerce-pay-methods-dialog',
    templateUrl: 'mat-commerce-pay-methods-dialog.component.html',
    styleUrls: [`mat-commerce-pay-methods-dialog.component.scss`]
  })
  export class MatCommercePayMethodsDialogComponent implements OnInit {

  constructor(
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: IPaymentMethodsDialogDataParams
    ) {
  }

  ngOnInit() {
  }


   
  
  } 
