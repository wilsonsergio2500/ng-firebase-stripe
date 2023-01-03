import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StripeCardElement, StripeCardElementChangeEvent, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardComponent } from 'ngx-stripe';
import { defaultStripeCardOptions, defaultStripeElementOptions } from './defaults';

export type IMatCommenrceApplyCardChange = { cardHolderName: string, card: StripeCardElement };

@Component({
  selector: 'matCommerce-stripe-card',
  templateUrl: 'stripe-card.component.html',
  styleUrls: [`stripe-card.component.scss`]
})
export class MatCommerceStripeCardComponent {

  private hasValidStripeCard = false;
  private hasBusyState = false;
  private hasAddCardDisplay = true;

  @Input() cardHolderNamePlaceholder = 'Card Holder Name';
  @Input() stripeCardOptions: StripeCardElementOptions = defaultStripeCardOptions;
  @Input() stripeElementsOptions: StripeElementsOptions = defaultStripeElementOptions;
  @Input() set busy(value: BooleanInput) {
    this.hasBusyState = coerceBooleanProperty(value);
  }
  get busy() {
    return this.hasBusyState;
  }
  @Input() set displayAddCard(value: BooleanInput) {
    this.hasAddCardDisplay = coerceBooleanProperty(value);
  }
  get displayAddCard() {
    return this.hasAddCardDisplay
  }
  @Output() applyCard = new EventEmitter<IMatCommenrceApplyCardChange>();
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

   formGroup = this.fb.group({
     cardHolderName: [null, Validators.required]
   })

  constructor(
    private readonly fb: FormBuilder
  ) { }

  get formValid() {
    return this.formGroup.valid && this.hasValidStripeCard;
  }

  cardChange($event: StripeCardElementChangeEvent) {
    this.hasValidStripeCard = (!!$event.error || !$event.complete) ? false : true;
  }

  submit() {
    const { cardHolderName } = this.formGroup.value;
    const card = this.card.element;
    if (card) {
      this.applyCard.emit({ cardHolderName, card });
    }
  }

} 
