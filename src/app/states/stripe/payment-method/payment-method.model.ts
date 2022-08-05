import { SetupIntent, StripeCardElement, StripeError } from "@stripe/stripe-js";
import { IStripeCustomersFirebaseModel } from "../customers/schema/stripe-customers.schema";
import { IPaymentMethodFireStoreModel } from "./schema/payment-method.schema";

export interface IPaymentMethodStateModel {
  loading: boolean;
  currentStripeUser: IStripeCustomersFirebaseModel,
  records: IPaymentMethodFireStoreModel[],
  preferred: IPaymentMethodFireStoreModel
  cardSetupError: StripeError,
}

export type StripeCustomerType =  IStripeCustomersFirebaseModel
export type SetupPaymentType = { name: string, card: StripeCardElement }
export type SetupPaymentErrorType = StripeError
export type SetupPaymentIntentType = SetupIntent;
export type PreferredPaymentType = IPaymentMethodFireStoreModel;
