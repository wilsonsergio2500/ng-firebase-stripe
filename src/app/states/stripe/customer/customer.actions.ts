import { ByIdType, ByPrefferedPaymentType } from "./customer.model";


export class CustomerIntializeAction {
  static readonly type = '[Customer] Initialize';
  constructor(public request: ByIdType) { }
}

export class CustomerInitializePreferredPayment {
  static type = '[Customer] Initialize Preferred Payment';
}

export class CustomerSetAsLoadingAction {
    static type = '[Customer] Set As Loading';
}

export class CustomerSetAsDoneAction {
    static type = '[Customer] Set As Done';
}

export class CustomerSetPreferredPayment {
  static type = '[Customer] Set Preferred Payment';
  constructor(public request: ByPrefferedPaymentType) { }
}
