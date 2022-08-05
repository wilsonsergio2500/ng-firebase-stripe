
export type currencyType = "usd" | "eur" | "gbp" | "jpy";
export type PaymentStatus = "new"

export interface IPaymentFireStoreModel {
  currency: currencyType;
  amount: number;
  status?: PaymentStatus;

  createDate?: number | Date;
  createdBy?: any;
}
