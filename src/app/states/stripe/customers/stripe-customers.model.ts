import { IFirebasePaginationInMemoryState } from '@firebase/paginations/firebase-pagination-inmemory';
import { PaymentMethod, StripeCardElement, StripeError } from '@stripe/stripe-js';
import { IStripeCustomersFirebaseModel } from './schema/stripe-customers.schema';

export interface IStripeCustomersStateModel {
  loading: boolean;
  addingCard: boolean;
  paginationState: IFirebasePaginationInMemoryState<IStripeCustomersFirebaseModel>;
  currentUserId: string,
  current: IStripeCustomersFirebaseModel;
  selected: IStripeCustomersFirebaseModel;
  cardSetupError: StripeError;
  paymentMethods: PaymentMethod[];
  preferredPaymentMethod: PaymentMethod;
}

export interface IConfirmCardSetupRequest {
  card: StripeCardElement,
  name: string;
}

export type currencyType = "usd" | "eur" | "gbp" | "jpy";
export type PaymentStatus = "new"

export interface IPaymentRequest {
  currency: currencyType;
  amount: number;
  status?: PaymentStatus;
}
