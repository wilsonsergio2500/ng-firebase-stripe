import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentMethod } from '@stripe/stripe-js';

export type MatCommerceManageModeType = "Manage" | "Selection";
export const MatCommerceManagePaymentViewModeTypes: { [key in MatCommerceManageModeType]: MatCommerceManageModeType} = { Manage: "Manage", Selection: "Selection"};
export type MatCommerceManagePaymentActionType = "remove" | "select" | "default";

@Component({
  selector: 'matCommerce-manage-payments',
  templateUrl: 'manage-payments.component.html',
  styleUrls: [`manage-payments.component.scss`]
})
export class MatCommerceManagePaymentsComponent {

  private displayBusyEnabled = true;
  modes = MatCommerceManagePaymentViewModeTypes;

  @Input() listHeading: string = 'Method of Payment';
  @Input() cardpaymentMethods: PaymentMethod[] = [];
  @Input() paymentIdBusy: string | null = null;
  @Input() paymentIdSelected: string | null = 'pm_1LTXazHCCV7PTjkI4hAiCS5u';
  @Input() paymentIdDefaulted: string | null = 'pm_1LTXazHCCV7PTjkI4hAiCS5u';
  @Input() mode: MatCommerceManageModeType = MatCommerceManagePaymentViewModeTypes.Manage;
  @Input() set displayBusy(value: BooleanInput) {
    this.displayBusyEnabled = coerceBooleanProperty(value);
  }
  get displayBusy() { return this.displayBusyEnabled; }
  @Output() remove = new EventEmitter<PaymentMethod>();
  @Output() select = new EventEmitter<PaymentMethod>();
  @Output() markedAsDefault = new EventEmitter<PaymentMethod>();

  columns = ['label', 'action', 'active'];

  hasBusyState(ele: PaymentMethod) {
    return (this.displayBusyEnabled && !!this.paymentIdBusy && ele.id == this.paymentIdBusy);
  }

  hasPaymentSelected(ele: PaymentMethod) {
    return (!!this.paymentIdSelected && ele.id == this.paymentIdSelected);
  }

  hasPaymentDefaulted(ele: PaymentMethod) {
    return (!!this.paymentIdDefaulted && ele.id == this.paymentIdDefaulted);
  }

  hasActiveState(ele: PaymentMethod) {
    return this.hasPaymentSelected(ele) || this.hasPaymentDefaulted(ele);
  }

  onRemove(ele: PaymentMethod) {
    this.remove.emit(ele);
  }

  onSelect(ele: PaymentMethod) {
    this.select.emit(ele);
  }

  onDefaulted(ele: PaymentMethod) {
    this.markedAsDefault.emit(ele);
  }
 
} 
