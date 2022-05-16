require('./utils/config');
import * as auth from './funcs/payments/createStripeCustomer';
import * as paymentMethods from './funcs/payments/paymentMethods';

export const createStripeCustomer = auth.createStripeCustomer;
export const addPaymentMethodDetails = paymentMethods.addPaymentMethodDetails;
export const removePaymentMethods = paymentMethods.removePaymentMethods;

