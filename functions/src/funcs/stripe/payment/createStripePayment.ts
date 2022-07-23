import * as functions from "firebase-functions";
import { stripe } from "../../../utils/config";
import { userFacingMessage } from "../../../utils/helpers";

export const createStripePayment = functions.firestore
  .document('stripe_customers/{userId}/payments/{pushId}')
  .onCreate(async (snap, context) => {
    const { amount, currency, payment_method } = snap.data();
    try {
      // Look up the Stripe customer id.
      const customer = (await snap.ref.parent.parent?.get())?.data()?.customer_id;
      // Create a charge using the pushId as the idempotency key
      // to protect against double charges.
      if (customer) {
        const idempotencyKey = context.params.pushId;
        const payment = await stripe.paymentIntents.create(
          {
            amount,
            currency,
            customer,
            payment_method,
            off_session: false,
            confirm: true,
            confirmation_method: 'manual',
          },
          { idempotencyKey }
        );
        // If the result is successful, write it back to the database.
        await snap.ref.set(payment);
      }

    } catch (error) {
      // We want to capture errors and render them in a user-friendly way, while
      // still logging an exception to Error Reporting.
      functions.logger.log(error);
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
      /*await reportError(error, { user: context.params.userId });*/
    }
  });
