
import * as functions from "firebase-functions";
import { stripe, fireStoreDb } from "../../../utils/config";

export const createStripeCustomer = functions.auth.user().onCreate(async (user) => {
  const customer = await stripe.customers.create({ email: user.email });
  const intent = await stripe.setupIntents.create({
    customer: customer.id,
  });
  await fireStoreDb.collection('stripe_customers').doc(user.uid).set({
    customer_id: customer.id,
    setup_secret: intent.client_secret,
    id: user.uid
  });
  return;
});
