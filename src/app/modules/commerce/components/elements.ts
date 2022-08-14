import { CardSelectorComponent } from "./card-selector/card-selector.component";
import { MatCommercePayMethodsDialogComponent } from "./pay-methods-dialog/mat-commerce-pay-methods-dialog.component";
import { PurchaseComponent } from "./purchase/purchase.component";

export function getComponents(){
  return [
    MatCommercePayMethodsDialogComponent,
      CardSelectorComponent,
      PurchaseComponent
    ];
}
