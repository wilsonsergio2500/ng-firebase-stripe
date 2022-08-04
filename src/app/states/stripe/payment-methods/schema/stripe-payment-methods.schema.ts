import { PaymentMethod } from "@stripe/stripe-js";

export interface IStripePaymentMethodFirebaseModel extends PaymentMethod  {
  paymentMethodId: string;
}
