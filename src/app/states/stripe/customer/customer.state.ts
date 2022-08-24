import { Injectable } from '@angular/core';
import { Store, State, Selector, StateContext, Action } from '@ngxs/store';
import { ICustomerStateModel } from './customer.model';
import { CustomerSetAsLoadingAction, CustomerSetAsDoneAction, CustomerIntializeAction, CustomerSetPreferredPayment, CustomerInitializePreferredPayment } from './customer.actions';
import { tap, mergeMap } from 'rxjs/operators';
import { CustomerFireStoreService } from './schema/customer.firebase';
import { PaymentInitializeAction } from '../payment/payment.actions';
import { ICustomerFireStoreModel } from './schema/customer.schema';
import { PaymentMethodInitializeAction } from '../payment-method/payment-method.actions';
import { PaymentMethod } from '@stripe/stripe-js';


@State<ICustomerStateModel>({
  name: 'customerState',
  defaults: <ICustomerStateModel>{
    loading: false,
    currentStripeCustomer: null,
    preferredPaymentMethod: null
  }
})
@Injectable()
export class CustomerState {

  constructor(
    private schema: CustomerFireStoreService
  ) { }

  @Selector()
  static IsLoading(state: ICustomerStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getCurrentCustomer(state: ICustomerStateModel): ICustomerFireStoreModel {
    return state.currentStripeCustomer
  }

  @Selector()
  static getPreferredPaymentMethod(state: ICustomerStateModel): PaymentMethod {
    return state.preferredPaymentMethod;
  }

  @Action(CustomerSetAsDoneAction)
  onDone(ctx: StateContext<ICustomerStateModel>) {
    ctx.patchState({
      loading: false
    });
  }
  @Action(CustomerSetAsLoadingAction)
  onLoading(ctx: StateContext<ICustomerStateModel>) {
    ctx.patchState({
      loading: true
    });
  }

  @Action(CustomerIntializeAction)
  onInitialize(ctx: StateContext<ICustomerStateModel>, action: CustomerIntializeAction) {
    const { id } = action.request;
    ctx.dispatch(new CustomerSetAsLoadingAction())
    return this.schema.docOnce$(id).pipe(
      tap(currentStripeCustomer => {
        ctx.patchState({ currentStripeCustomer })
      }),
      mergeMap(() => ctx.dispatch([
        new CustomerInitializePreferredPayment(),
        new PaymentInitializeAction({ id }),
        new PaymentMethodInitializeAction({ id }),
        new CustomerSetAsDoneAction()
      ]))
    )
  }

  @Action(CustomerInitializePreferredPayment)
  onIntilizePrefferedPaymentMethod(ctx: StateContext<ICustomerStateModel>) {
    const { currentStripeCustomer } = ctx.getState();
    if (currentStripeCustomer.preferred_payment) {
      ctx.patchState({ preferredPaymentMethod: currentStripeCustomer.preferred_payment })
    }

  }

  @Action(CustomerSetPreferredPayment)
  onSetPrefferedMethod(ctx: StateContext<ICustomerStateModel>, action: CustomerSetPreferredPayment) {
    const { request } = action;
    const { currentStripeCustomer } = ctx.getState();
    return this.schema.merge({ preferred_payment: { ...request } }, currentStripeCustomer.id).pipe(
      tap(() => ctx.patchState({ preferredPaymentMethod: {...request} }) )
    );
  }

}
