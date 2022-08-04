import { Injectable } from '@angular/core';
import { Store, State, Selector, StateContext, Action } from '@ngxs/store';
import { StripePaymentMethodsFireStoreService } from './schema/stripe-payment-methods.firebase';
import { IStripePaymentMethodsStateModel } from './stripe-payment-methods.model';
import { StripePaymentMethodsSetAsLoadingAction, StripePaymentMethodsSetAsDoneAction, StripePaymentMethodsLoadCurrentUserAction, StripePaymentMethodsLoadAction, StripePaymentMethodsSetupPaymentAction, StripePaymentMethodsSetupPaymentRaiseErrorAction, StripePaymentMethodsAddPaymentMethodAction, StripePaymentMethodsSetPreferredMethodAction, StripePaymentMethodsRemoveMethodAction } from './stripe-payment-methods.actions';
import { tap, mergeMap, filter } from 'rxjs/operators';
import { SnackbarStatusService } from '@customComponents/ux/snackbar-status/service/snackbar-status.service';
import { ConfirmationDialogService } from '@customComponents/ux/confirmation-dialog/confirmation-dialog.service';
import { StripeService } from 'ngx-stripe';
import { ConfirmCardSetupData } from '@stripe/stripe-js';
import { IStripePaymentMethodFirebaseModel } from './schema/stripe-payment-methods.schema';
import { iif } from 'rxjs';


@State<IStripePaymentMethodsStateModel>({
  name: 'stripePaymentMethodsState',
  defaults: <IStripePaymentMethodsStateModel>{
    loading: false,
    currentStripeUser: null,
    records: [],
    preferred: null,
    cardSetupError : null,
  }
})
@Injectable()
export class StripePaymentMethodsState {

  constructor(
    private snackBarStatus: SnackbarStatusService,
    private confirmationDialog: ConfirmationDialogService,
    private schema: StripePaymentMethodsFireStoreService,
    private stripeService: StripeService
  ) {
  }

  @Selector()
  static IsLoading(state: IStripePaymentMethodsStateModel): boolean {
    return state.loading;
  }


  @Selector()
  static getPreferredPaymentMethod(state: IStripePaymentMethodsStateModel): IStripePaymentMethodFirebaseModel {
    return state.preferred;;
  }

  @Selector()
  static getPaymentMethods(state: IStripePaymentMethodsStateModel): IStripePaymentMethodFirebaseModel[] {
    return state.records;
  }

  @Selector()
  static hasPaymentMethods(state: IStripePaymentMethodsStateModel) {
    return (state.records?.length ?? 0) > 0;
  }

  @Action(StripePaymentMethodsSetAsDoneAction)
  onDone(ctx: StateContext<IStripePaymentMethodsStateModel>) {
    ctx.patchState({
      loading: false
    });
  }
  @Action(StripePaymentMethodsSetAsLoadingAction)
  onLoading(ctx: StateContext<IStripePaymentMethodsStateModel>) {
    ctx.patchState({
      loading: true
    });
  }

  @Action(StripePaymentMethodsLoadCurrentUserAction)
  onSetCurrentUser(ctx: StateContext<IStripePaymentMethodsStateModel>, action: StripePaymentMethodsLoadCurrentUserAction) {
    const { request: currentStripeUser } = action;
    this.schema.setCustomer(currentStripeUser.id);
    ctx.patchState({
      currentStripeUser
    })
    return ctx.dispatch(new StripePaymentMethodsLoadAction());
  }

  @Action(StripePaymentMethodsLoadAction)
  onLoadPaymentMethods(ctx: StateContext<IStripePaymentMethodsStateModel>) {
    return ctx.dispatch(new StripePaymentMethodsSetAsLoadingAction()).pipe(
      mergeMap(() => this.schema.collectionOnce$().pipe(
        filter(pms => !!pms?.length),
        tap(records => ctx.patchState({ records }))
      )
      ),
      mergeMap(() => ctx.dispatch(new StripePaymentMethodsSetAsDoneAction()))
    )
  }

  @Action(StripePaymentMethodsSetupPaymentAction)
  onSetupPaymentMethod(ctx: StateContext<IStripePaymentMethodsStateModel>, action: StripePaymentMethodsSetupPaymentAction) {
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
          ctx.dispatch(new StripePaymentMethodsSetupPaymentRaiseErrorAction(error)),
          ctx.dispatch(new StripePaymentMethodsAddPaymentMethodAction(setupIntent))
        )
      })
    )
  }

  @Action(StripePaymentMethodsAddPaymentMethodAction)
  onAddPayment(ctx: StateContext<IStripePaymentMethodsStateModel>, action: StripePaymentMethodsAddPaymentMethodAction) {
    const { payment_method, id } = action.request
    return this.schema.merge({ paymentMethodId: payment_method }, id);
  }

  @Action(StripePaymentMethodsSetupPaymentRaiseErrorAction)
  onSetupPaymentRaiseError(ctx: StateContext<IStripePaymentMethodsStateModel>, action: StripePaymentMethodsSetupPaymentRaiseErrorAction) {
    const { request: cardSetupError } = action;
    ctx.patchState({ cardSetupError})
  }

  @Action(StripePaymentMethodsSetPreferredMethodAction)
  onSetPreferredPaymentMethod(ctx: StateContext<IStripePaymentMethodsStateModel>, action: StripePaymentMethodsSetPreferredMethodAction ) {
    const { request: preferred } = action;
    ctx.patchState({ preferred });
  }

  @Action(StripePaymentMethodsRemoveMethodAction)
  onRemovePaymentMethod(ctx: StateContext<IStripePaymentMethodsStateModel>, action: StripePaymentMethodsRemoveMethodAction) {
    const { id } = action.request;
    return this.confirmationDialog.OnConfirm('Are you sure you would like to remove this payment method?').pipe(
      mergeMap(() => this.schema.delete(id)),
      tap(() => this.snackBarStatus.OpenComplete('Payment method removed')),
      mergeMap(() => ctx.dispatch(new StripePaymentMethodsLoadAction()))
    )

  }


}
