import { ICustomerFireStoreModel } from './schema/customer.schema';

export interface ICustomerStateModel {
  loading: boolean;
  currentStripeCustomer: ICustomerFireStoreModel
}
