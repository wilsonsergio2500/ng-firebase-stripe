import { Injectable } from '@angular/core';
import { Store, State, Selector, StateContext, Action } from '@ngxs/store';
import { ICustomerStateModel } from './customer.model';
import { CustomerSetAsLoadingAction, CustomerSetAsDoneAction, CustomerIntializeAction } from './customer.actions';
import { tap, mergeMap } from 'rxjs/operators';
import { CustomerFireStoreService } from './schema/customer.firebase';
import { PaymentInitializeAction } from '../payment/payment.actions';


@State<ICustomerStateModel>({
    name: 'customerState',
    defaults: <ICustomerStateModel>{
        loading: false,
        currentStripeCustomer: null,
    }
})
@Injectable()
export class CustomerState {

    constructor(
      private schema: CustomerFireStoreService
    ){}

  @Selector()
  static IsLoading(state: ICustomerStateModel) : boolean {
    return state.loading;
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
        console.log(currentStripeCustomer);
        ctx.patchState({ currentStripeCustomer })
      }),
      mergeMap(() => ctx.dispatch([
        new PaymentInitializeAction({id}),
        new CustomerSetAsDoneAction()
      ]))
    )
  }


}
