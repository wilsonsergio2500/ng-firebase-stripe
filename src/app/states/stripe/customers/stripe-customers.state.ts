import { Injectable } from '@angular/core';
import { Store, State, Selector, StateContext, Action } from '@ngxs/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, from, of } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { AuthState } from '@states/auth/auth.state';
import { StripeCustomersFireStore } from './schema/stripe-customers.firebase';
import { IStripeCustomersFirebaseModel } from './schema/stripe-customers.schema';
import { IStripeCustomersStateModel } from './stripe-customers.model';
import { StripeCustomersSetAsLoadingAction, StripeCustomersSetAsDoneAction,  StripeCustomersLoadByIdAction, StripeCustomersInitializeAction, StripeCustomersConfirmCardPaymentAction, StripeCustomersSetupCardErrorAction, StripeCustomersLoadPaymentMethodsAction, StripeCustomersCleanErrorAction, StripeCustomersSetAddingCardAsLoadingAction, StripeCustomersSetAddingCardAsDoneAction, StripeCustomersRemovePaymentMethod } from './stripe-customers.actions';
import { tap, mergeMap, delay, filter } from 'rxjs/operators';
import { SnackbarStatusService } from '@customComponents/ux/snackbar-status/service/snackbar-status.service';
import { ConfirmationDialogService } from '@customComponents/ux/confirmation-dialog/confirmation-dialog.service';
import { FirebasePaginationInMemoryStateModel } from '@firebase/paginations/firebase-pagination-inmemory';
import { StripeService } from 'ngx-stripe';
import { ConfirmCardSetupData, PaymentMethod, StripeError } from '@stripe/stripe-js';


@State<IStripeCustomersStateModel>({
  name: 'stripeCustomersState',
  defaults: <IStripeCustomersStateModel>{
    loading: false,
    addingCard: false,
    paginationState: new FirebasePaginationInMemoryStateModel<IStripeCustomersFirebaseModel>(),
    currentId: null,
    current: null,
    selected: null,
    cardSetupError: null,
    paymentMethods: [],
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
    return ctx.dispatch(new StripeCustomersLoadByIdAction(id));
  }

  @Action(StripeCustomersLoadByIdAction)
  onGetById(ctx: StateContext<IStripeCustomersStateModel>, action: StripeCustomersLoadByIdAction) {
    const { id } = action;
    ctx.dispatch(new StripeCustomersSetAsLoadingAction());
    return this.schemas.doc$(id).pipe(
      filter(record => !!record),
      mergeMap(record => {
        const current = { ...record, id };
        ctx.patchState({ current });
        return of(current);
      }),
      tap(() => ctx.dispatch(new StripeCustomersLoadPaymentMethodsAction()))
    );
  }
  

  @Action(StripeCustomersConfirmCardPaymentAction)
  onConfirmCardPayment(ctx: StateContext<IStripeCustomersStateModel>, action: StripeCustomersConfirmCardPaymentAction) {
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
      tap(() => this.snackBarStatus.OpenComplete('Payment method removed'))
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

}
