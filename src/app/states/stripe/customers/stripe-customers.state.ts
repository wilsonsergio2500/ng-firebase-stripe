import { Injectable } from '@angular/core';
import { Store, State, Selector, StateContext, Action } from '@ngxs/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, of } from 'rxjs';
import { StripeCustomersFireStore } from './schema/stripe-customers.firebase';
import { IStripeCustomersFirebaseModel } from './schema/stripe-customers.schema';
import { IStripeCustomersStateModel } from './stripe-customers.model';
import { StripeCustomersSetAsLoadingAction, StripeCustomersSetAsDoneAction,  StripeCustomersInitializeAction, StripeCustomersConfirmCardSetuptAction, StripeCustomersSetupCardErrorAction, StripeCustomersLoadPaymentMethodsAction, StripeCustomersCleanErrorAction, StripeCustomersSetAddingCardAsLoadingAction, StripeCustomersSetAddingCardAsDoneAction, StripeCustomersRemovePaymentMethod, StripeCustomersLoadAction, StripeCustomersAddPaymentAction, StripeCustomersSetPreferredPaymentMethod } from './stripe-customers.actions';
import { tap, mergeMap, filter } from 'rxjs/operators';
import { SnackbarStatusService } from '@customComponents/ux/snackbar-status/service/snackbar-status.service';
import { ConfirmationDialogService } from '@customComponents/ux/confirmation-dialog/confirmation-dialog.service';
import { FirebasePaginationInMemoryStateModel } from '@firebase/paginations/firebase-pagination-inmemory';
import { StripeService } from 'ngx-stripe';
import { ConfirmCardSetupData, PaymentMethod, StripeError } from '@stripe/stripe-js';
import { stripeHelpers } from '@appUtils/stripe-helpers';


@State<IStripeCustomersStateModel>({
  name: 'stripeCustomersState',
  defaults: <IStripeCustomersStateModel>{
    loading: false,
    addingCard: false,
    paginationState: new FirebasePaginationInMemoryStateModel<IStripeCustomersFirebaseModel>(),
    currentUserId: null,
    current: null,
    selected: null,
    cardSetupError: null,
    paymentMethods: [],
    preferredPaymentMethod: null
  }
})
@Injectable()
export class StripeCustomersState {

  private schemas: StripeCustomersFireStore;
  private subscription: Subscription;
  constructor(
    private store: Store,
    private snackBarStatus: SnackbarStatusService,
    private confirmationDialog: ConfirmationDialogService,
    private stripeService: StripeService,
    angularFireStore: AngularFirestore
  ) {
    this.schemas = new StripeCustomersFireStore(angularFireStore);
  }

  @Selector()
  static IsLoading(state: IStripeCustomersStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static IsAddingCardWorking(state: IStripeCustomersStateModel): boolean {
    return state.addingCard
  }

  @Selector()
  static getCurrentPage(state: IStripeCustomersStateModel): IStripeCustomersFirebaseModel[] {
    return state.paginationState.page;
  }

  @Selector()
  static getPageSize(state: IStripeCustomersStateModel): number {
    return state.paginationState.paginator.pageSize;
  }

  @Selector()
  static getCollectionTotalSize(state: IStripeCustomersStateModel): number {
    return state.paginationState.items.length;
  }
  @Selector()
  static getAllPages(state: IStripeCustomersStateModel): IStripeCustomersFirebaseModel[] {
    return state.paginationState.items;
  }

  @Selector()
  static getCurrent(state: IStripeCustomersStateModel): IStripeCustomersFirebaseModel {
    return state.current;
  }

  @Selector()
  static getSelected(state: IStripeCustomersStateModel): IStripeCustomersFirebaseModel {
    return state.selected;
  }

  @Selector()
  static preferredPaymentMethod(state: IStripeCustomersStateModel): PaymentMethod {
    return state.preferredPaymentMethod
  }

  @Selector()
  static getUserPaymentMethods(state: IStripeCustomersStateModel): PaymentMethod[] {
    const paymentsCards = state.paymentMethods.filter(g => !!g.card);
    return paymentsCards;
  }

  @Selector()
  static getCardErrors(state: IStripeCustomersStateModel): StripeError {
    return state.cardSetupError;
  }


  @Action(StripeCustomersSetAsDoneAction)
  onDone(ctx: StateContext<IStripeCustomersStateModel>) {
    ctx.patchState({
      loading: false
    });
  }
  @Action(StripeCustomersSetAsLoadingAction)
  onLoading(ctx: StateContext<IStripeCustomersStateModel>) {
    ctx.patchState({
      loading: true
    });
  }

  @Action(StripeCustomersSetAddingCardAsLoadingAction)
  onAddingCardLoading(ctx: StateContext<IStripeCustomersStateModel>) {
    ctx.patchState({ addingCard: true });
  }

  @Action(StripeCustomersSetAddingCardAsDoneAction)
  onAddingCardDone(ctx: StateContext<IStripeCustomersStateModel>) {
    ctx.patchState({ addingCard: false})
  }

  @Action(StripeCustomersInitializeAction)
  onInitalize(ctx: StateContext<IStripeCustomersStateModel>, action: StripeCustomersInitializeAction) {
    const { id } = action;
    ctx.patchState({ currentUserId: id });
    ctx.dispatch(new StripeCustomersLoadAction());
    return;
  }

  @Action(StripeCustomersLoadAction)
  onGetById(ctx: StateContext<IStripeCustomersStateModel>) {
    const { currentUserId } = ctx.getState();
    return this.schemas.doc$(currentUserId).pipe(
      filter(record => !!record),
      mergeMap(record => {
        const current = { ...record, id: currentUserId };
        ctx.patchState({ current });
        return of(current);
      }),
      mergeMap(() => ctx.dispatch(new StripeCustomersSetAsLoadingAction())),
      tap(() => ctx.dispatch(new StripeCustomersLoadPaymentMethodsAction()))
    );
  }
  

  @Action(StripeCustomersConfirmCardSetuptAction)
  onConfirmCardPayment(ctx: StateContext<IStripeCustomersStateModel>, action: StripeCustomersConfirmCardSetuptAction) {
    const { current } = ctx.getState();
    const { card, name } = action.request;

    ctx.dispatch(new StripeCustomersCleanErrorAction());
    ctx.dispatch(new StripeCustomersSetAddingCardAsLoadingAction());

    const cardSetup = <ConfirmCardSetupData>{
      payment_method: {
        card,
        billing_details: {
          name
        }
      }
    }

    return this.stripeService.confirmCardSetup(current.setup_secret, cardSetup).pipe(
      mergeMap(({ setupIntent, error }) => {

        if (error) {
          return ctx.dispatch(new StripeCustomersSetupCardErrorAction(error));
        }
        
        return this.schemas.merge([current.id, 'payment_methods', setupIntent.id], { id: setupIntent.payment_method });

      })
    )
  }

  @Action(StripeCustomersLoadPaymentMethodsAction)
  onStripeGetPaymentMethods(ctx: StateContext<IStripeCustomersStateModel>) {
    const { current } = ctx.getState();

    return this.schemas.subCollection$<PaymentMethod>(current.id, 'payment_methods').pipe(
      filter(methods => !!methods?.length),
      tap((paymentMethods) => {
        ctx.patchState({ paymentMethods });
      }),
      mergeMap(() => ctx.dispatch([
        new StripeCustomersSetAsDoneAction(),
        new StripeCustomersSetAddingCardAsDoneAction()
      ]))
    );

  }

  @Action(StripeCustomersRemovePaymentMethod)
  onRemovePaymentMethod(ctx: StateContext<IStripeCustomersStateModel>, action: StripeCustomersRemovePaymentMethod) {
    const { current } = ctx.getState();
    const { id } = action;
    return this.confirmationDialog.OnConfirm('Are you sure you would like to remove this payment method?').pipe(
      mergeMap(() => this.schemas.doc([current.id, 'payment_methods', id]).delete()),
      tap(() => this.snackBarStatus.OpenComplete('Payment method removed')),
      mergeMap(() => ctx.dispatch(new  StripeCustomersLoadAction()))
    )
  }



  @Action(StripeCustomersSetupCardErrorAction)
  onCardSetupError(ctx: StateContext<IStripeCustomersStateModel>, action: StripeCustomersSetupCardErrorAction) {
    const { request: cardSetupError } = action;
    ctx.patchState({ cardSetupError });
    ctx.dispatch(new StripeCustomersSetAddingCardAsDoneAction());
  }

  @Action(StripeCustomersCleanErrorAction)
  onCleanErrors(ctx: StateContext<IStripeCustomersStateModel>) {
    ctx.patchState({ cardSetupError: null });
  }

  @Action(StripeCustomersAddPaymentAction)
  onAddPaymentAction(ctx: StateContext<IStripeCustomersStateModel>, action: StripeCustomersAddPaymentAction) {
    const { current, preferredPaymentMethod: payment_method } = ctx.getState();
    const { currency, amount  } = action.request;
    const paymentId = this.schemas.fireStoreId;
    return this.schemas.merge([current.id, 'payments', paymentId], { status: "new", payment_method: payment_method.id, currency, amount: stripeHelpers.formatAmount(amount, currency) });

  }

  @Action(StripeCustomersSetPreferredPaymentMethod)
  onSetPrefferedPaymentMethod(ctx: StateContext<IStripeCustomersStateModel>, action: StripeCustomersSetPreferredPaymentMethod) {
    ctx.patchState({ preferredPaymentMethod: action.request });
  }


}
