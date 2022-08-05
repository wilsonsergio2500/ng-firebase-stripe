import { State, Selector, NgxsOnInit, StateContext, Action } from "@ngxs/store";
import { IAuthStateModel, User } from './auth.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthLoadSessionAction, AuthLoginSuccessAction, AuthLoginFailAction, AuthLogoutSuccessAction, AuthLoginWithEmailAndPasswordAction, AuthLogoutAction, AuthLoginRedirectOnAuthenticatedAction, AuthCreateUserwithEmailAndPasswordAction, AuthRegistrationErrorAction, AuthCleanErrorMessageAction, AuthRegistrationSuccessAction, AuthSetAsLoadingAction, AuthSetAsDoneAction } from './auth.actions';
import { take, tap, mergeMap, catchError, delay, finalize } from 'rxjs/operators';
import { Navigate } from '@ngxs/router-plugin';
import { EMPTY, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { SnackbarStatusService } from "@customComponents/ux/snackbar-status/service/snackbar-status.service";
import { IUserFirebaseModel } from "../users/schema/user.schema";
import { UserCreateAction } from "../users/users.actions";
import { CustomerIntializeAction } from "../stripe/customer/customer.actions";

const REGISTRATION_ERROR_GENERIC = 'The User could not be registered at this moment';

@State<IAuthStateModel>({
  name: 'auth',
  defaults: <IAuthStateModel>{
    user: null,
    errorMessage: null,
    working: false,
    customClaims: null
  }
})
@Injectable()
export class AuthState implements NgxsOnInit {

  private mainPage = 'main';
  private loginPage = '/login';

  constructor(
    private fireAuth: AngularFireAuth,
    private snackBarStatus: SnackbarStatusService
  ) {
  }

  ngxsOnInit(ctx?: StateContext<IAuthStateModel>) {
    ctx.dispatch(new AuthLoadSessionAction())
  }

  @Selector()
  static getUser(state: IAuthStateModel) {
    return state.user;
  }


  @Selector()
  static getErrorMessage(state: IAuthStateModel) {
    return state.errorMessage;
  }

  @Selector()
  static IsLoading(state: IAuthStateModel) {
    return state.working;
  }


  @Action(AuthSetAsLoadingAction)
  onLoading(ctx: StateContext<IAuthStateModel>) {
    ctx.patchState({ working: true });
  }

  @Action(AuthSetAsDoneAction)
  onDone(ctx: StateContext<IAuthStateModel>) {
    ctx.patchState({ working: false });
  }


  @Action(AuthLoadSessionAction)
  onLoadSession(ctx: StateContext<IAuthStateModel>) {
    ctx.dispatch(new AuthSetAsLoadingAction());
    return this.fireAuth.authState.pipe(
      take(1),
      mergeMap((user: User) => {
        if (user) {
          const { uid, phoneNumber, photoURL, email, displayName } = user;
          ctx.dispatch(new AuthLoginSuccessAction({ uid, phoneNumber, photoURL, email, displayName }));
          ctx.dispatch(new CustomerIntializeAction({ id: uid }));
          return from(user.getIdTokenResult());
        }
        return EMPTY;
      }),
      //tap((token: FirebaseTokenResult) => {
      //  const { superuser, admin, editor, blogger } = token.claims as ISecurityTypeInUserSecurityFirebaseModel
      //  const customClaims = { superuser, admin, editor, blogger };
      //  ctx.patchState({ customClaims })
      //}),
      finalize(() => ctx.dispatch(new AuthSetAsDoneAction()))
    )
  }

  @Action(AuthLoginWithEmailAndPasswordAction)
  onAuthenticatUser(ctx: StateContext<IAuthStateModel>, action: AuthLoginWithEmailAndPasswordAction) {

    ctx.dispatch(new AuthSetAsLoadingAction());
    return from(this.fireAuth.signInWithEmailAndPassword(action.request.email, action.request.password)).pipe(
      mergeMap(userCredentials => {
        const { uid, phoneNumber, photoURL, email, displayName } = userCredentials.user;
        return ctx.dispatch([
          new AuthLoginSuccessAction({ uid, phoneNumber, photoURL, email, displayName }),
          new AuthLoginRedirectOnAuthenticatedAction()
        ]);
      }),
      delay(1000),
      tap(() => {
        this.snackBarStatus.OpenComplete('Authenticated');
        ctx.dispatch(new AuthSetAsDoneAction());
        ctx.dispatch(new AuthLoadSessionAction());
      }),
      catchError(() => {
        ctx.dispatch(new AuthSetAsDoneAction());
        return ctx.dispatch(new AuthLoginFailAction())
      })
    );

  }

  @Action(AuthCreateUserwithEmailAndPasswordAction)
  onCreateUserWithEmailAndPassword(ctx: StateContext<IAuthStateModel>, action: AuthCreateUserwithEmailAndPasswordAction) {

    const { email, password } = action.request;
    ctx.dispatch(new AuthSetAsLoadingAction());
    return from(this.fireAuth.createUserWithEmailAndPassword(email, password)).pipe(
      mergeMap(credentials => {

        const { user: firebaseUser } = credentials;
        const { uid: id, phoneNumber, photoURL, email, displayName } = firebaseUser;
        const user = <IUserFirebaseModel>{ id, phoneNumber, photoURL, email, displayName, createdBy: id };
   
        return ctx.dispatch(new UserCreateAction(user));
      }),
      delay(1000),
      tap(() => {
        ctx.dispatch(new AuthSetAsDoneAction());
        ctx.dispatch(new AuthLoginRedirectOnAuthenticatedAction());
      }),
      catchError(error => {
        const errorMessage = (error.message) ? error.message : REGISTRATION_ERROR_GENERIC;
        ctx.dispatch(new AuthSetAsDoneAction());
        return ctx.dispatch(new AuthRegistrationErrorAction(errorMessage));
      })
    );

  }

  @Action(AuthLoginRedirectOnAuthenticatedAction)
  onAuthenticatedRedirect(ctx: StateContext<IAuthStateModel>) {
    ctx.dispatch(new Navigate([this.mainPage]))
  }

  @Action(AuthLogoutAction)
  onLogOut(ctx: StateContext<IAuthStateModel>) {
    this.fireAuth.signOut().then(_ => {
      ctx.dispatch(new AuthLogoutSuccessAction())
    })
  }

  @Action(AuthLoginSuccessAction)
  onLoginSuccess(ctx: StateContext<IAuthStateModel>, action: AuthLoginSuccessAction) {
    ctx.patchState({
      user: action.user
    })
  }

  @Action([AuthLoginFailAction, AuthLogoutSuccessAction])
  onLogout(ctx: StateContext<IAuthStateModel>) {
    ctx.patchState({
      user: null
    });
    ctx.dispatch(new Navigate([this.loginPage]))
  }

  @Action(AuthRegistrationErrorAction)
  onRegistrationError(ctx: StateContext<IAuthStateModel>, action: AuthRegistrationErrorAction) {
    const { message: errorMessage } = action;
    ctx.patchState({ errorMessage });
  }

  @Action(AuthRegistrationSuccessAction)
  OnRegistrationSuccess(ctx: StateContext<IAuthStateModel>) {
    ctx.dispatch(new AuthCleanErrorMessageAction());
  }

  @Action(AuthCleanErrorMessageAction)
  onCleanErrorMessage(ctx: StateContext<IAuthStateModel>) {
    ctx.patchState({ errorMessage: null })
  }
}
