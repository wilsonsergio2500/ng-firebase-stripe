import { Injectable } from '@angular/core';
import { Store, State, Selector, StateContext, Action } from '@ngxs/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, from, of, iif } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { AuthState } from '@states/auth/auth.state';
import { IPaymentMethodStateModel } from './payment-method.model';
import { PaymentMethodSetAsLoadingAction, PaymentMethodSetAsDoneAction, PaymentMethodRemoveAction, PaymentMethodInitializeAction, PaymentMethodLoadAllAction, PaymentMethodSetupAction, PaymentMethodSetupOnErrorAction, PaymentMethodAddAction, PaymentMethodSetPreferredAction, PaymentMethodClearUpSetupErrorAction } from './payment-method.actions';
import { tap, mergeMap, delay, filter, finalize, catchError, map } from 'rxjs/operators';
import { StripeService } from 'ngx-stripe';
import { ConfirmCardSetupData, StripeError } from '@stripe/stripe-js';
import { PaymentMethodFireStoreService } from './schema/payment-method.firebase';
import { SnackbarStatusService } from '@customComponents/ux/snackbar-status/service/snackbar-status.service';
import { ConfirmationDialogService } from '@customComponents/ux/confirmation-dialog/confirmation-dialog.service';
import { IPaymentMethodFireStoreModel } from './schema/payment-method.schema';
import { CustomerState } from '../customer/customer.state';


@State<IPaymentMethodStateModel>({
  name: 'paymentMethodState',
  defaults: <IPaymentMethodStateModel>{
    loading: false,
    records: [],
    preferred: null,
    cardSetupError: null,
  }
})
@Injectable()
export class PaymentMethodState {

  constructor(
    private store: Store,
    private snackBarStatus: SnackbarStatusService,
    private confirmationDialog: ConfirmationDialogService,
    private schema: PaymentMethodFireStoreService,
    private stripeService: StripeService
  ) {
  }

  @Selector()
  static IsLoading(state: IPaymentMethodStateModel): boolean {
    return state.loading;
  }


  @Selector()
  static getPreferredPaymentMethod(state: IPaymentMethodStateModel): IPaymentMethodFireStoreModel {
    return state.preferred;;
  }

  @Selector()
  static getPaymentMethods(state: IPaymentMethodStateModel): IPaymentMethodFireStoreModel[] {
    return state.records;
  }

  @Selector()
  static getPaymentSetupError(state: IPaymentMethodStateModel): StripeError {
    return state.cardSetupError;
  }

  @Selector()
  static hasPaymentMethods(state: IPaymentMethodStateModel) {
    return (state.records?.length ?? 0) > 0;
  }


  @Action(PaymentMethodSetAsDoneAction)
  onDone(ctx: StateContext<IPaymentMethodStateModel>) {
    ctx.patchState({
      loading: false
    });
  }
  @Action(PaymentMethodSetAsLoadingAction)
  onLoading(ctx: StateContext<IPaymentMethodStateModel>) {
    ctx.patchState({
      loading: true
    });
  }

  @Action(PaymentMethodInitializeAction)
  onInitialize(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodInitializeAction) {
    const { id } = action.request;
    this.schema.setCustomer(id);
    return ctx.dispatch(new PaymentMethodLoadAllAction());
  }

  @Action(PaymentMethodLoadAllAction)
  onLoadPaymentMethods(ctx: StateContext<IPaymentMethodStateModel>) {
    return ctx.dispatch(new PaymentMethodSetAsLoadingAction()).pipe(
      mergeMap(() => this.schema.collection$().pipe(
        filter(pms => !!pms?.length),
        map(records => records.filter(g => !!g.customer)),
        filter(pms => !!pms?.length),
        tap(records => ctx.patchState({ records }))
      )
      ),
      mergeMap(() => ctx.dispatch(new PaymentMethodSetAsDoneAction()))
    )
  }

  @Action(PaymentMethodSetupAction)
  onLoadAll(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodSetupAction) {
    const { card, name } = action.request;
    const cardSetup = <ConfirmCardSetupData>{
      payment_method: {
        card,
        billing_details: {
          name
        }
      }
    }
    ctx.dispatch(new PaymentMethodSetAsLoadingAction());
    return this.store.selectOnce(CustomerState.getCurrentCustomer).pipe(
      mergeMap(currentStripeUser => this.stripeService.confirmCardSetup(currentStripeUser.setup_secret, cardSetup)),
      mergeMap(({ setupIntent, error }) => {
        return iif(() => !!error,
          ctx.dispatch(new PaymentMethodSetupOnErrorAction(error)),
          ctx.dispatch(new PaymentMethodAddAction(setupIntent))
        )
      })
    );

  }

  @Action(PaymentMethodSetupOnErrorAction)
  onSetupPaymentRaiseError(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodSetupOnErrorAction) {
    const { request: cardSetupError } = action;
    ctx.patchState({ cardSetupError });
    return ctx.dispatch(new PaymentMethodSetAsDoneAction());
  }

  @Action(PaymentMethodClearUpSetupErrorAction)
  onClearUpSetupError(ctx: StateContext<IPaymentMethodStateModel>) {
    ctx.patchState({ cardSetupError: null });
  }

  @Action(PaymentMethodAddAction)
  onAddPayment(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodAddAction) {
    const { payment_method, id } = action.request
    return this.schema.merge({ paymentMethodId: payment_method }, id).pipe(
      mergeMap(() => ctx.dispatch(new PaymentMethodSetAsDoneAction())),
      tap(() => this.snackBarStatus.OpenComplete('Payment Method has been added'))
    );
  }

  @Action(PaymentMethodSetPreferredAction)
  onSetPreferredPaymentMethod(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodSetPreferredAction) {
    const { request: preferred } = action;
    ctx.patchState({ preferred });
  }

  @Action(PaymentMethodRemoveAction)
  onRemovePaymentMethod(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodRemoveAction) {
    const { id } = action.request;
    return this.confirmationDialog.OnConfirm('Are you sure you would like to remove this payment method?').pipe(
      mergeMap(() => this.schema.delete(id)),
      tap(() => this.snackBarStatus.OpenComplete('Payment method removed')),
    );
  }



}
