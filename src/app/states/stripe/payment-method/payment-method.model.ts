import { SetupIntent, StripeCardElement, StripeError } from "@stripe/stripe-js";
import { ICustomerFireStoreModel } from "../customer/schema/customer.schema";
import { IPaymentMethodFireStoreModel } from "./schema/payment-method.schema";

export interface IPaymentMethodStateModel {
  loading: boolean;
  currentStripeUser: ICustomerFireStoreModel,
  records: IPaymentMethodFireStoreModel[],
  preferred: IPaymentMethodFireStoreModel
  cardSetupError: StripeError,
}

export type StripeCustomerType = ICustomerFireStoreModel
export type SetupPaymentType = { name: string, card: StripeCardElement }
export type SetupPaymentErrorType = StripeError
export type SetupPaymentIntentType = SetupIntent;
export type PreferredPaymentType = IPaymentMethodFireStoreModel;
