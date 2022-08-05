import { ICustomerFireStoreModel } from './schema/customer.schema';

export interface ICustomerStateModel {
  loading: boolean;
  currentStripeCustomer: ICustomerFireStoreModel
}

export type ByIdType = { id: string };
