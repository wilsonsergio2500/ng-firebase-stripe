import { PaymentMethod } from "@stripe/stripe-js";

export interface ICustomerFireStoreModel {
  id?: string;
  customer_id: string;
  setup_secret?: string;
  preferred_payment: PaymentMethod
}


