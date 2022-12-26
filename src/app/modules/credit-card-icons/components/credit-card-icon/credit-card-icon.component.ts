import { Component, Input } from '@angular/core';
import { ICON_NAME_PREFIX, MatCommerceCreditCardIconType } from '../helpers';
import { icons } from '../icons';

@Component({
  selector: 'matCommerce-credit-card-icon',
  templateUrl: 'credit-card-icon.component.html',
  styleUrls: [`credit-card-icon.component.scss`]
})
export class MatCommerceCreditCardIconComponent {

  @Input() cardType: MatCommerceCreditCardIconType = "unknown";

  get icon() {
    return (this.supportedIcon) ? `${ICON_NAME_PREFIX}-${this.cardType}` : `${ICON_NAME_PREFIX}-unkown` ;
  }

  get supportedIcon() {
    return Object.keys(icons).some(g => g == this.cardType);
  }
} 
