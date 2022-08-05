import { Injectable } from '@angular/core';
import { Store, State, Selector, StateContext, Action } from '@ngxs/store';
import { AuthState } from '@states/auth/auth.state';
import { IPaymentStateModel } from './payment.model';
import { PaymentSetAsLoadingAction, PaymentSetAsDoneAction, PaymentCreateAction, PaymentInitializeAction } from './payment.actions';
import { mergeMap, filter, map } from 'rxjs/operators';
import { PaymentFireStoreService } from './schema/payment.firebase';
import { SnackbarStatusService } from '@customComponents/ux/snackbar-status/service/snackbar-status.service';
import { ConfirmationDialogService } from '@customComponents/ux/confirmation-dialog/confirmation-dialog.service';
import { PaymentMethodState } from '../payment-method/payment-method.state';
import { stripeHelpers } from '../../../utils/stripe-helpers';


@State<IPaymentStateModel>({
  name: 'paymentState',
  defaults: <IPaymentStateModel>{
    loading: false,
    currentId: null,
    current: null,
    selected: null
  }
})
@Injectable()
export class PaymentState {

  constructor(
    private store: Store,
    private snackBarStatus: SnackbarStatusService,
    private confirmationDialog: ConfirmationDialogService,
    private schema: PaymentFireStoreService
  ) {
  }

  @Selector()
  static IsLoading(state: IPaymentStateModel): boolean {
    return state.loading;
  }

  @Action(PaymentSetAsDoneAction)
  onDone(ctx: StateContext<IPaymentStateModel>) {
    ctx.patchState({
      loading: false
    });
  }
  @Action(PaymentSetAsLoadingAction)
  onLoading(ctx: StateContext<IPaymentStateModel>) {
    ctx.patchState({
      loading: true
    });
  }

  @Action(PaymentInitializeAction)
  onInitializeUserPayment(ctx: StateContext<IPaymentStateModel>, action: PaymentInitializeAction) {
    const { id } = action.request;
    this.schema.setCustomer(id);
  }

  @Action(PaymentCreateAction)
  onCreate(ctx: StateContext<IPaymentStateModel>, action: PaymentCreateAction) {
    const { currency, amount } = action.request;
    return this.store.selectOnce(PaymentMethodState.getPreferredPaymentMethod).pipe(
      filter(pm => !!pm),
      mergeMap(payment_method =>
        this.store.selectOnce(AuthState.getUser).pipe(
          map(u => ({ payment_method, createDate: Date.now(), createBy:u }))
        )
      ),
      mergeMap(meta => {
        return this.schema.merge({ ...meta, currency, amount: stripeHelpers.formatAmount(amount, currency) });
      })
    )
  }



}
