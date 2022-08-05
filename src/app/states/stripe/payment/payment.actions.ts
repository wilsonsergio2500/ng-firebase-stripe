import { ByIdType, PaymentRequestType } from "./payment.model";



export class PaymentSetAsLoadingAction {
    static readonly type = '[Payment] Set As Loading';
}

export class PaymentSetAsDoneAction {
    static readonly type = '[Payment] Set As Done';
}

export class PaymentInitializeAction {
  static readonly type = '[Payment] Initialize User';
  constructor(public request: ByIdType) { }
}

export class PaymentCreateAction{
    static type = '[Payment] Create';
  constructor(public request: PaymentRequestType) { }
}

//export class PaymentUpdateAction{
//  static type = '[Payment] Update';
//  constructor(public request: IPaymentFirebaseModel) { }
//}

//export class PaymentRemoveAction{
//  static type = '[Payment] Remove';
//  constructor(public request: IPaymentFirebaseModel) { }
//}

//export class PaymentGetByIdAction{
//  static type = '[Payment] Get By Id';
//  constructor(public id: string) { }
//}

//export class PaymentLoadFirstPageAction{
//  static type = '[Payment] Load First Page';
//}

//export class PaymentLoadNextPageAction{
//  static type = '[Payment] Load Next Page';
//}

//export class PaymentLoadPreviousPageAction{
//  static type = '[Payment] Load Previous Page';
//}
