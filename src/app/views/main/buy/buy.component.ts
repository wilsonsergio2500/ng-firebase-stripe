import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Appearance, PaymentMethod, StripeCardElementChangeEvent, StripeCardElementOptions, StripeElementsOptions, StripeError } from '@stripe/stripe-js';
import { StripeCardComponent } from 'ngx-stripe';
import { FormTypeBuilder, NgTypeFormGroup } from 'reactive-forms-typed';
import { IPaymentForm } from './payment.form';
import { merge, Observable, Subscription, zip } from 'rxjs';
import { PaymentMethodState } from '@states/stripe/payment-method/payment-method.state';
import { CustomerState } from '@states/stripe/customer/customer.state';
import { IPaymentMethodFireStoreModel } from '@states/stripe/payment-method/schema/payment-method.schema';
import { PaymentMethodRemoveAction, PaymentMethodSetupAction } from '@states/stripe/payment-method/payment-method.actions';
import { PaymentCreateAction } from '@states/stripe/payment/payment.actions';
import { currencyType } from '@states/stripe/payment/schema/payment.schema';
import { MatCommercePayMethodsDialogService } from '@materialCommerce/services/pay-methods-dialog/mat-commerce-pay-methods-dialog.service';
import { CustomerSetPreferredPayment } from '@states/stripe/customer/customer.actions';
import { filter, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'buy',
  templateUrl: 'buy.component.html',
  styleUrls: [`buy.component.scss`]
})
export class BuyComponent implements OnInit, OnDestroy {

  hasValidCard = false;
  formGroup: NgTypeFormGroup<IPaymentForm>;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  

  @Select(CustomerState.getPreferredPaymentMethod) preferredPaymentMethod$: Observable<PaymentMethod>;
  @Select(PaymentMethodState.getPaymentMethods) paymentMethods$: Observable<IPaymentMethodFireStoreModel[]>;
  @Select(PaymentMethodState.getPaymentSetupError) cardError$: Observable<StripeError>;
  @Select(PaymentMethodState.IsLoading) addingCard$: Observable<boolean>;
  @Select(CustomerState.IsLoading) loading$: Observable<boolean>;


  productDetail = { name: 'A Great Product', currency: 'usd', price: 100 }
  subs$: Subscription[] = [];

  constructor(
    private store: Store,
    private formTypeBuilder: FormTypeBuilder,
    private paymentSelectionService: MatCommercePayMethodsDialogService
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

  appearance: Appearance = {
    theme: 'stripe',
    labels: 'floating',
    variables: {
      colorPrimary: '#673ab7',
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  get hasFormValid() {
    return this.formGroup.valid && this.hasValidCard;
  }

  onStripeCardChange($event: StripeCardElementChangeEvent) {
    this.hasValidCard = (!!$event.error || !$event.complete) ? false : true;
  }

  submit() {
    this.store.dispatch(new PaymentMethodSetupAction({ card: this.card.element, name: this.formGroup.value.cardHolderName }))
  }

  onRemove(id: string) {
    this.store.dispatch(new PaymentMethodRemoveAction({ id }));
  }

  onSelectPayment(pm: IPaymentMethodFireStoreModel) {
    this.store.dispatch(new CustomerSetPreferredPayment(pm));
  }

  onPurchase(pd: { name: string, currency: string, price: number }) {
    console.log(pd);
    this.store.dispatch(new PaymentCreateAction({ currency: pd.currency as currencyType, amount: pd.price}))
  }

  pickPrefferedPayment() {

    const pick$ = zip(this.paymentMethods$, this.preferredPaymentMethod$).pipe(
      mergeMap(([options, preferred]) => {
        return this.paymentSelectionService.OnOpen({ options, preferred })
      })
    ).subscribe();

    this.subs$ = [...this.subs$, pick$];
    
  }

  ngOnDestroy() {
    if (this.subs$?.length) {
      this.subs$.forEach(s => s.unsubscribe());
    }
  }

}
