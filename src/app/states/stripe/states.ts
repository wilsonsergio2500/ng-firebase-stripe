import { CustomerState } from "./customer/customer.state";
import { PaymentMethodState } from "./payment-method/payment-method.state";
import { PaymentState } from "./payment/payment.state";

export function getStates() {
  return [
    CustomerState,
    PaymentState,
    PaymentMethodState
  ];
}
