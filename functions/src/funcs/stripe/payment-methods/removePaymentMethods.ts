import * as functions from "firebase-functions";
import { stripe } from "../../../utils/config";
import { userFacingMessage } from "../../../utils/helpers";

export const removePaymentMethods = functions.firestore
  .document('/stripe_customers/{userId}/payment_methods/{pushId}')
  .onDelete(async (snap, context) => {
    try {
      const paymentMethodId = snap.data().id;
      await stripe.paymentMethods.detach(paymentMethodId)
      return;
    }
    catch (error) {
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
    }
  });
