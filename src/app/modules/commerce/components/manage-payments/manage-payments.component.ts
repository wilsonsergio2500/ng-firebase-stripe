import { Component, Input } from '@angular/core';
import { PaymentMethod } from '@stripe/stripe-js';

@Component({
  selector: 'matCommerce-manage-payments',
  templateUrl: 'manage-payments.component.html',
  styleUrls: [`manage-payments.component.scss`]
})
export class MatCommerceManagePaymentsComponent {

  @Input() listHeading: string = 'Method of Payment';
  @Input() cardpaymentMethods: PaymentMethod[] = [];

  columns = ['label', 'action'];

  onRemove() {

  }

} 
