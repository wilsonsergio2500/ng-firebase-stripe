import { CardSelectorComponent } from "./card-selector/card-selector.component";
import { MatCommerceManagePaymentsComponent } from "./manage-payments/manage-payments.component";
import { MatCommercePayMethodsDialogComponent } from "./pay-methods-dialog/mat-commerce-pay-methods-dialog.component";
import { PurchaseComponent } from "./purchase/purchase.component";
import { MatCommerceStripeCardComponent } from "./stripe-card/stripe-card.component";

export function getComponents() {
  return [
    MatCommercePayMethodsDialogComponent,
    MatCommerceStripeCardComponent,
    MatCommerceManagePaymentsComponent,
    CardSelectorComponent,
    PurchaseComponent
  ];
}
