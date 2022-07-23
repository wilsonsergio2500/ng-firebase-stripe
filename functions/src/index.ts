require('./utils/config');
//import * as auth from './funcs/payments/createStripeCustomer';
//import * as paymentMethods from './funcs/payments/paymentMethods';
//import * as payment from './funcs/payments/createStripePayment'

//export const createStripeCustomer = auth.createStripeCustomer;
//export const addPaymentMethodDetails = paymentMethods.addPaymentMethodDetails;
//export const removePaymentMethods = paymentMethods.removePaymentMethods;
//export const createStripePayment = payment.createStripePayment;

import * as customer from './funcs/stripe/customer';
import * as paymentMethods from './funcs/stripe/payment-methods';
import * as payment from './funcs/stripe/payment';

export const createStripeCustomer = customer.createStripeCustomer;
export const cleanUpCustomer = customer.cleanUpCustomer;

export const addPaymentMethodDetails = paymentMethods.addPaymentMethodDetails;
export const removePaymentMethods = paymentMethods.removePaymentMethods;

export const createStripePayment = payment.createStripePayment;
export const confirmStripePayment = payment.confirmStripePayment;
