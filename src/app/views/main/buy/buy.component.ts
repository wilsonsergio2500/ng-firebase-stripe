import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { PaymentMethod, StripeCardElementOptions, StripeElementsOptions, StripeError } from '@stripe/stripe-js';
import { StripeCardComponent } from 'ngx-stripe';
import { FormTypeBuilder, NgTypeFormGroup } from 'reactive-forms-typed';
import { StripeCustomersConfirmCardSetuptAction, StripeCustomersRemovePaymentMethod } from '@states/stripe/customers/stripe-customers.actions';
import { IPaymentForm } from './payment.form';
import { StripeCustomersState } from '@states/stripe/customers/stripe-customers.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'buy',
  templateUrl: 'buy.component.html',
  styleUrls: [`buy.component.scss`]
})
export class BuyComponent implements OnInit {

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  formGroup: NgTypeFormGroup<IPaymentForm>;

  @Select(StripeCustomersState.getUserPaymentMethods) paymentMethods$: Observable<PaymentMethod>;
  @Select(StripeCustomersState.getCardErrors) cardError$: Observable<StripeError>;
  @Select(StripeCustomersState.IsAddingCardWorking) addingCard$: Observable<boolean>;
  @Select(StripeCustomersState.IsLoading) loading$: Observable<boolean>;

  constructor(
    private store: Store,
    private formTypeBuilder: FormTypeBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.formTypeBuilder.group<IPaymentForm>({
      cardHolderName: [null, Validators.required]
    })
  }

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  submit() {
    this.store.dispatch(new StripeCustomersConfirmCardSetuptAction({ card: this.card.element, name: this.formGroup.value.cardHolderName }))
  }

  onRemove(id: string) {
    this.store.dispatch(new StripeCustomersRemovePaymentMethod(id));
  }

  onSelectPayment(pm : PaymentMethod) {
    console.log(pm);
  }

}
