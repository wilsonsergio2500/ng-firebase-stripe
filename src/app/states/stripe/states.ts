import { StripeCustomersState } from "./customers/stripe-customers.state";
import { StripePaymentMethodsState } from "./payment-methods/stripe-payment-methods.state";

export function getStates() {
  return [
    StripeCustomersState,
    StripePaymentMethodsState
  ];
}
