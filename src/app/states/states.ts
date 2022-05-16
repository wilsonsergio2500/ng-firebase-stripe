import { AuthState } from "./auth/auth.state";
import { UsersState } from "./users/users.state";
import {getStates as getStripeStates } from './stripe/states';

export function getStates(){
    return [
      AuthState,
      UsersState,
      ...getStripeStates()
    ];
}
