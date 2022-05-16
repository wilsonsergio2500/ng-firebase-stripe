
import { StripeError } from '@stripe/stripe-js';
import { IStripeCustomersFirebaseModel } from './schema/stripe-customers.schema';
import { IConfirmCardPaymenRequest } from './stripe-customers.model';

export class StripeCustomersSetAsLoadingAction {
  static type = '[Stripe Customers] Set As Loading';
}

export class StripeCustomersSetAsDoneAction {
  static type = '[Stripe Customers] Set As Done';
}

export class StripeCustomersSetAddingCardAsLoadingAction {
  static type = '[Stripe Customers] Set Adding Card As Loading';
}

export class StripeCustomersSetAddingCardAsDoneAction {
  static type = '[Stripe Customers] Set Adding Card As Done';
}

export class StripeCustomersLoadByIdAction {
  static type = '[Stripe Customers] Get By Id';
  constructor(public id: string) { }
}

export class StripeCustomersInitializeAction {
  static type = '[Stripe Customers] Initilize Session';
  constructor(public id: string) { }
}

export class StripeCustomersConfirmCardPaymentAction {
  static type = '[Stripe Customers] Confirm Card Payment';
  constructor(public request: IConfirmCardPaymenRequest) { }
}

export class StripeCustomersSetupCardErrorAction {
  static type = '[Stripe Customers] Card Setup Error';
  constructor(public request: StripeError) { }
}

export class StripeCustomersLoadPaymentMethodsAction {
  static type = '[Stripe Customers] Load Payment Methods';
}

export class StripeCustomersCleanErrorAction {
  static type = '[Stripe Customers] Clean Error';
}

export class StripeCustomersRemovePaymentMethod {
  static type = '[Stripe Customers] Remove Payment Method';
  constructor(public id: string) {}
}
