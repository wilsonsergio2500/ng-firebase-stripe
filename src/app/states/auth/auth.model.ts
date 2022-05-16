import firebase from 'firebase'

export type User = firebase.User;
export type AppFirebaseUser = { uid: string, phoneNumber: string, photoURL: string, email, displayName: string }
export type FirebaseTokenResult = firebase.auth.IdTokenResult;

export interface IAuthStateModel {
  user: Partial<User>;
  errorMessage: string;
  working: boolean;
}

export interface IAuthenticateUser {
  email: string;
  password: string;
}

export interface IRegistrationUser extends IAuthenticateUser { }

export interface IAppPrivileges {
  hasSuperUser: boolean,
  hasAdmin: boolean,
  hasEditor: boolean,
  hasBlogger: boolean
  hasStore:boolean
}

