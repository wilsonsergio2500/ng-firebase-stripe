import { PaymentMethod } from "@stripe/stripe-js";

export interface IPaymentMethodFireStoreModel extends PaymentMethod {
  paymentMethodId: string;
}
