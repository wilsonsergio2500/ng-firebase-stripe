import { Injectable } from '@angular/core';
import { Store, State, Selector, StateContext, Action } from '@ngxs/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, from, of } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { AuthState } from '@states/auth/auth.state';
import { IPaymentStateModel } from './payment.model';
import { PaymentSetAsLoadingAction, PaymentSetAsDoneAction, PaymentCreateAction, PaymentInitializeAction } from './payment.actions';
import { tap, mergeMap, delay, filter, finalize, catchError } from 'rxjs/operators';
import { Logger } from '@appUtils/logger';
import { PaymentFireStoreService } from './schema/payment.firebase';
import { SnackbarStatusService } from '@customComponents/ux/snackbar-status/service/snackbar-status.service';
import { ConfirmationDialogService } from '@customComponents/ux/confirmation-dialog/confirmation-dialog.service';


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

  //@Action(PaymentCreateAction)
  //onCreate(ctx: StateContext<IPaymentStateModel>, action: PaymentCreateAction) {
  //  return ctx.dispatch(new PaymentSetAsLoadingAction()).pipe(
  //    mergeMap(() => this.store.selectOnce(AuthState.getUser)),
  //    mergeMap(user => {
  //      const metadata = { createDate: Date.now(), createdBy: user }
  //      const payment = { ...action.request, ...metadata };
  //      return this.schema.create(payment)
  //    }),
  //    mergeMap(() => ctx.dispatch(new PaymentSetAsDoneAction()))
  //  );
  //}



}
