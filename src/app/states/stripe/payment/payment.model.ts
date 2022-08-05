import { currencyType, PaymentStatus } from "../customers/stripe-customers.model";

export interface IPaymentStateModel {
    loading: boolean;
    //currentId: string,
    //current: IPaymentFirebaseModel;
    //selected: IPaymentFirebaseModel;
}

export type ByIdType = { id: string };
export type PaymentRequestType = { currency: currencyType; amount: number; status?: PaymentStatus }
