import { IAuthenticateUser, User, IRegistrationUser } from './auth.model';

export class AuthSetAsLoadingAction {
    static type = '[Auth] Set As Loading';
}

export class AuthSetAsDoneAction {
    static type = '[Auth] Set As Done';
}

export class AuthLoadSessionAction {
    static type = '[Auth] LoadSession';
}

export class AuthLoginSuccessAction {
    static type = '[Auth] LoginSuccess';
    constructor(public user: Partial<User>) { }
}

export class AuthLoginFailAction {
   static type = '[Auth] LoginFail'
}

export class AuthLogoutSuccessAction {
    static type = '[Auth] LogoutSuccess';
}

export class AuthLoginWithEmailAndPasswordAction {
    static type = '[Auth] Login With Email And Password'
    constructor(public request: IAuthenticateUser) { }
}

export class AuthCreateUserwithEmailAndPasswordAction {
    static type = '[Auth] Create User With Email And Password';
    constructor(public request: IRegistrationUser) { }
}

export class AuthRegistrationErrorAction {
    static type = '[Auth] Registration Error';
    constructor(public message: string) { }
}

export class AuthRegistrationSuccessAction {
    static type = '[Auth] Registration Success';
}

export class AuthCleanErrorMessageAction {
    static type = '[Auth] Clean Error Message';
}


export class AuthLoginRedirectOnAuthenticatedAction {
  static type = '[Auth] RedirectOnAuthenticated'
}

export class AuthLogoutAction {
    static type = '[Auth] Logout';
}
