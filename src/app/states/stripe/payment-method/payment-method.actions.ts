import { ByIdType } from "../customer/customer.model";
import { PreferredPaymentType, SetupPaymentErrorType, SetupPaymentIntentType, SetupPaymentType, StripeCustomerType } from "./payment-method.model";


export class PaymentMethodSetAsLoadingAction {
    static readonly type = '[Payment Method] Set As Loading';
}

export class PaymentMethodSetAsDoneAction {
    static readonly type = '[Payment Method] Set As Done';
}

export class PaymentMethodInitializeAction {
  static readonly type = '[Payment Method] Initialize';
  constructor(public request: StripeCustomerType) { }
}

export class PaymentMethodLoadAllAction {
  static readonly type = '[Payment Method] Load';
}

export class PaymentMethodSetupAction {
  static readonly type = '[Payment Method] Setup';
  constructor(public request: SetupPaymentType) { }
}

export class PaymentMethodSetupOnErrorAction {
  static readonly type = '[Payment Method] Setup Error';
  constructor(public request: SetupPaymentErrorType) { }
}

export class PaymentMethodClearUpSetupErrorAction {
  static readonly type = '[Payment Method] Clear Setup Error';
}

export class PaymentMethodAddAction {
  static readonly type = '[Payment Method] Add';
  constructor(public request: SetupPaymentIntentType) { }
}

export class PaymentMethodSetPreferredAction {
  static readonly type = '[Payment Method] Set Preferred';
  constructor(public request: PreferredPaymentType) { }
}

export class PaymentMethodRemoveAction {
  static readonly type = '[Payment Method] Remove';
  constructor(public request: ByIdType) { }
}
