import { CustomerState } from "./customer/customer.state";
import { StripeCustomersState } from "./customers/stripe-customers.state";
import { StripePaymentMethodsState } from "./payment-methods/stripe-payment-methods.state";

export function getStates() {
  return [
    CustomerState,
    StripeCustomersState,
    StripePaymentMethodsState
  ];
}
