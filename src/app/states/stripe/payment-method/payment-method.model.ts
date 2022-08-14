import { SetupIntent, StripeCardElement, StripeError } from "@stripe/stripe-js";
import { IPaymentMethodFireStoreModel } from "./schema/payment-method.schema";

export interface IPaymentMethodStateModel {
  loading: boolean;
  records: IPaymentMethodFireStoreModel[],
  cardSetupError: StripeError,
}

export type SetupPaymentType = { name: string, card: StripeCardElement }
export type SetupPaymentErrorType = StripeError
export type SetupPaymentIntentType = SetupIntent;
export type PreferredPaymentType = IPaymentMethodFireStoreModel;
