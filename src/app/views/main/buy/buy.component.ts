import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { PaymentMethod, StripeCardElementOptions, StripeElementsOptions, StripeError } from '@stripe/stripe-js';
import { StripeCardComponent } from 'ngx-stripe';
import { FormTypeBuilder, NgTypeFormGroup } from 'reactive-forms-typed';
import { IPaymentForm } from './payment.form';
import { Observable } from 'rxjs';
import { PaymentMethodState } from '@states/stripe/payment-method/payment-method.state';
import { CustomerState } from '@states/stripe/customer/customer.state';
import { IPaymentMethodFireStoreModel } from '@states/stripe/payment-method/schema/payment-method.schema';
import { PaymentMethodRemoveAction, PaymentMethodSetPreferredAction, PaymentMethodSetupAction } from '../../../states/stripe/payment-method/payment-method.actions';
import { PaymentCreateAction } from '@states/stripe/payment/payment.actions';
import { currencyType } from '../../../modules/store/components/purchase/purchase.component';

@Component({
  selector: 'buy',
  templateUrl: 'buy.component.html',
  styleUrls: [`buy.component.scss`]
})
export class BuyComponent implements OnInit {

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  formGroup: NgTypeFormGroup<IPaymentForm>;

  @Select(PaymentMethodState.getPreferredPaymentMethod) preferredPaymentMethod$: Observable<PaymentMethod>;
  @Select(PaymentMethodState.getPaymentMethods) paymentMethods$: Observable<IPaymentMethodFireStoreModel>;
  @Select(PaymentMethodState.getPaymentSetupError) cardError$: Observable<StripeError>;
  @Select(PaymentMethodState.IsLoading) addingCard$: Observable<boolean>;


  @Select(CustomerState.IsLoading) loading$: Observable<boolean>;


  productDetail = { name: 'A Great Product', currency : 'usd', price: 100 }

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
    this.store.dispatch(new PaymentMethodSetupAction({ card: this.card.element, name: this.formGroup.value.cardHolderName }))
  }

  onRemove(id: string) {
    this.store.dispatch(new PaymentMethodRemoveAction({ id }));
  }

  onSelectPayment(pm: IPaymentMethodFireStoreModel) {
    this.store.dispatch(new PaymentMethodSetPreferredAction(pm));
  }

  onPurchase(pd: { name: string, currency: string, price: number }) {
    console.log(pd);
    this.store.dispatch(new PaymentCreateAction({ currency: pd.currency as currencyType, amount: pd.price}))
  }

}
