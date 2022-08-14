import { PaymentMethod } from '@stripe/stripe-js';
import { ICustomerFireStoreModel } from './schema/customer.schema';

export interface ICustomerStateModel {
  loading: boolean;
  currentStripeCustomer: ICustomerFireStoreModel
  preferredPaymentMethod: PaymentMethod;
}

export type ByIdType = { id: string };
export type ByPrefferedPaymentType = PaymentMethod
