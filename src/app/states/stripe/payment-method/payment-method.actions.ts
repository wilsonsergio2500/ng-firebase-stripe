import { ById, SetupPaymentError, SetupPaymentIntent } from "../payment-methods/stripe-payment-methods.model";
import { PreferredPaymentType, SetupPaymentType, StripeCustomerType } from "./payment-method.model";


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
  constructor(public request: SetupPaymentError) { }
}

export class PaymentMethodAddAction {
  static readonly type = '[Payment Method] Add';
  constructor(public request: SetupPaymentIntent) { }
}

export class PaymentMethodSetPreferredAction {
  static readonly type = '[Payment Method] Set Preferred';
  constructor(public request: PreferredPaymentType) { }
}

export class PaymentMethodRemoveAction {
  static readonly type = '[Payment Method] Remove';
  constructor(public request: ById) { }
}

//export class PaymentMethodCreateAction{
//   static readonly type = '[Payment Method] Create';
//  constructor(public request: IPaymentMethodFirebaseModel) { }
//}

//export class PaymentMethodUpdateAction{
//  static type = '[Payment Method] Update';
//  constructor(public request: IPaymentMethodFirebaseModel) { }
//}

//export class PaymentMethodRemoveAction{
//  static type = '[Payment Method] Remove';
//  constructor(public request: IPaymentMethodFirebaseModel) { }
//}

//export class PaymentMethodGetByIdAction{
//  static type = '[Payment Method] Get By Id';
//  constructor(public id: string) { }
//}

//export class PaymentMethodLoadFirstPageAction{
//  static type = '[Payment Method] Load First Page';
//}

//export class PaymentMethodLoadNextPageAction{
//  static type = '[Payment Method] Load Next Page';
//}

//export class PaymentMethodLoadPreviousPageAction{
//  static type = '[Payment Method] Load Previous Page';
//}
