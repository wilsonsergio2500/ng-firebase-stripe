import * as functions from "firebase-functions";
import { stripe } from "../../../utils/config";
import { userFacingMessage } from "../../../utils/helpers";

export const addPaymentMethodDetails = functions.firestore
  .document('/stripe_customers/{userId}/payment_methods/{pushId}')
  .onCreate(async (snap, context) => {
    try {
      const { pushId } = context.params;
      const paymentMethodId = snap.data().paymentMethodId;
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentMethodId
      );
      paymentMethod.metadata!.fireStoreId = pushId;
      await snap.ref.set(paymentMethod, { merge : true});
      // Create a new SetupIntent so the customer can add a new method next time.

      functions.logger.warn(`Adding Payment Method`, paymentMethod);

      const intent = await stripe.setupIntents.create({
        customer: `${paymentMethod.customer}`,
      });
      if (snap.ref.parent?.parent) {
        await snap.ref.parent.parent.set(
          {
            setup_secret: intent.client_secret,
          },
          { merge: true }
        );
      }
      return;
    } catch (error) {
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
    }
  });
