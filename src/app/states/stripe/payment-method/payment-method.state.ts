import { Injectable } from '@angular/core';
import { Store, State, Selector, StateContext, Action } from '@ngxs/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, from, of, iif } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { AuthState } from '@states/auth/auth.state';
import { IPaymentMethodStateModel } from './payment-method.model';
import { PaymentMethodSetAsLoadingAction, PaymentMethodSetAsDoneAction, PaymentMethodCreateAction, PaymentMethodUpdateAction, PaymentMethodRemoveAction, PaymentMethodGetByIdAction, PaymentMethodLoadFirstPageAction, PaymentMethodLoadNextPageAction, PaymentMethodLoadPreviousPageAction, PaymentMethodInitializeAction, PaymentMethodLoadAllAction, PaymentMethodSetupAction, PaymentMethodSetupOnErrorAction, PaymentMethodAddAction, PaymentMethodSetPreferredAction } from './payment-method.actions';
import { tap, mergeMap, delay, filter, finalize, catchError } from 'rxjs/operators';
import { StripeService } from 'ngx-stripe';
import { ConfirmCardSetupData } from '@stripe/stripe-js';
import { PaymentMethodFireStoreService } from './schema/payment-method.firebase';


@State<IPaymentMethodStateModel>({
  name: 'paymentMethodState',
  defaults: <IPaymentMethodStateModel>{
    loading: false,
    currentStripeUser: null,
    records: [],
    preferred: null,
    cardSetupError: null,
  }
})
@Injectable()
export class PaymentMethodState {

  private subscription: Subscription;
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
    const { request: currentStripeUser } = action;
    this.schema.setCustomer(currentStripeUser.id);
    ctx.patchState({ currentStripeUser });
  }

  @Action(PaymentMethodLoadAllAction)
  onLoadPaymentMethods(ctx: StateContext<IPaymentMethodStateModel>) {
    return ctx.dispatch(new PaymentMethodSetAsLoadingAction()).pipe(
      mergeMap(() => this.schema.collectionOnce$().pipe(
        filter(pms => !!pms?.length),
        tap(records => ctx.patchState({ records }))
      )
      ),
      mergeMap(() => ctx.dispatch(new PaymentMethodSetAsDoneAction()))
    )
  }

  @Action(PaymentMethodSetupAction)
  onLoadAll(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodSetupAction) {
    const { currentStripeUser } = ctx.getState();
    const { card, name } = action.request;
    const cardSetup = <ConfirmCardSetupData>{
      payment_method: {
        card,
        billing_details: {
          name
        }
      }
    }
    return this.stripeService.confirmCardSetup(currentStripeUser.setup_secret, cardSetup).pipe(
      mergeMap(({ setupIntent, error }) => {
        return iif(() => !!error,
          ctx.dispatch(new PaymentMethodSetupOnErrorAction(error)),
          ctx.dispatch(new PaymentMethodAddAction(setupIntent))
        )
      })
    )
  }

  @Action(PaymentMethodSetupOnErrorAction)
  onSetupPaymentRaiseError(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodSetupOnErrorAction) {
    const { request: cardSetupError } = action;
    ctx.patchState({ cardSetupError })
  }

  @Action(PaymentMethodAddAction)
  onAddPayment(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodAddAction) {
    const { payment_method, id } = action.request
    return this.schema.merge({ paymentMethodId: payment_method }, id);
  }

  @Action(PaymentMethodSetPreferredAction)
  onSetPreferredPaymentMethod(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodSetPreferredAction) {
    const { request: preferred } = action;
    ctx.patchState({ preferred });
  }

 

  @Action(PaymentMethodUpdateAction)
  onUpdateAction(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodUpdateAction) {
    return this.store.selectOnce(AuthState.getUser).pipe(
      mergeMap((user) => {
        const now = Date.now();
        const metadata = <Partial<IFireBaseEntity>>{ updatedDate: now, updatedBy: user }
        const form = { ...action.request, ...metadata };
        return this.schemas.update(action.request.Id, form);
      }),
      delay(1000),
      tap(() => {
        this.snackBarStatus.OpenComplete('Payment Method Updated Succesfully');
        ctx.dispatch(new Navigate(['admin/PaymentMethod']));
      })
    );
  }

  @Action(PaymentMethodRemoveAction)
  onRemove(ctx: StateContext<IPaymentMethodStateModel>, action: PaymentMethodRemoveAction) {
    const { Id } = action.request;
    return this.confirmationDialog.OnConfirm('Are you sure you would like to delete this Payment Method?').pipe(
      mergeMap(() => from(this.schemas.delete(Id))),
      tap(() => this.snackBarStatus.OpenComplete('Payment Method has been Removed')),
    )
  }





}
