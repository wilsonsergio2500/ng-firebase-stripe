import { PaymentMethod, SetupIntent, StripeCardElement, StripeError } from '@stripe/stripe-js';
import { IStripeCustomersFirebaseModel } from '../customers/schema/stripe-customers.schema';
import { IStripePaymentMethodFirebaseModel } from './schema/stripe-payment-methods.schema';

export interface IStripePaymentMethodsStateModel {
  loading: boolean;
  currentStripeUser: IStripeCustomersFirebaseModel,
  records: IStripePaymentMethodFirebaseModel[],
  preferred: IStripePaymentMethodFirebaseModel
  cardSetupError: StripeError,
}

export type ById = { id: string };
export type SetupPayment = { name: string, card: StripeCardElement }
export type SetupPaymentError = StripeError
export type SetupPaymentIntent = SetupIntent;
export type PreferredPayment = IStripePaymentMethodFirebaseModel;
