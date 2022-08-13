import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentMethod } from '@stripe/stripe-js';

@Component({
  selector: 'card-selector',
  templateUrl: 'card-selector.component.html',
  styleUrls: [`card-selector.component.scss`]
})
export class CardSelectorComponent {

  @Input() paymentMethods: PaymentMethod[] = [];
  @Input() displayAddFirstMethod = false;
  @Output() onRemoveCard = new EventEmitter<string>();
  @Output() onSelectPaymentMethod = new EventEmitter<PaymentMethod>();

  private currentId: string = null;

  onSelect(pm: PaymentMethod) {
    this.currentId = pm?.id;
    this.onSelectPaymentMethod.emit(pm);
  }

  hasSelected(pm: PaymentMethod) {
    const selected = this.currentId === pm?.id;
    return selected;
  }

  onRemove(pm: PaymentMethod) {
    const { fireStoreId } = pm.metadata
    this.onRemoveCard.emit(fireStoreId);
  }

}
