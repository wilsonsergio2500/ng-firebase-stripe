import { Component, Input } from '@angular/core';

export type CreditCardType = "visa" | "mastercard" | "amex" | "unkown";
export const ICON_PREFIX = 'credit-card-';

@Component({
  selector: 'mat-creditcard-icon',
  templateUrl: 'mat-creditcard-icon.component.html',
  styleUrls: [`mat-creditcard-icon.component.scss`]
})
export class MatCreditcardIconComponent {

  @Input() cardType: CreditCardType = "unkown";

  get icon() {
    return `${ICON_PREFIX}${this.cardType}`;
  }

} 
