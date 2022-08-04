import { IStripeCustomersFirebaseModel } from "../customers/schema/stripe-customers.schema";
import { ById, PreferredPayment, SetupPayment, SetupPaymentError, SetupPaymentIntent } from "./stripe-payment-methods.model";

export class StripePaymentMethodsSetAsLoadingAction {
    static type = '[Stripe Payment Methods] Set As Loading';
}

export class StripePaymentMethodsSetAsDoneAction {
    static type = '[Stripe Payment Methods] Set As Done';
}

export class StripePaymentMethodsLoadCurrentUserAction {
  static type = '[Stripe Payment Methods] Load Current User';
  constructor(public request: IStripeCustomersFirebaseModel) { }
}

export class StripePaymentMethodsLoadAction {
  static type = '[Stripe Payment Methods] Load Payment Methods';
}

export class StripePaymentMethodsSetupPaymentAction {
  static type = '[Stripe Payment Methods] Setup Payment Method';
  constructor(public request: SetupPayment) {}
}

export class StripePaymentMethodsSetupPaymentRaiseErrorAction {
  static type = '[Stripe Payment Methods] Setup Payment Method On Error';
  constructor(public request: SetupPaymentError) {}
}

export class StripePaymentMethodsAddPaymentMethodAction {
  static type = '[Stripe Payment Methods] Add Payment Method';
  constructor(public request: SetupPaymentIntent) {}
}

export class StripePaymentMethodsSetPreferredMethodAction {
  static type = '[Stripe Payment Methods] Set preferred Payment Method';
  constructor(public request: PreferredPayment) { }
}

export class StripePaymentMethodsRemoveMethodAction {
  static type = '[Stripe Payment Methods] Remove Payment Method';
  constructor(public request: ById) { }
}

