
import * as functions from "firebase-functions";
import { stripe, fireStoreDb } from "../../../utils/config";

export const cleanUpCustomer = functions.auth.user().onDelete(async (user) => {
  const dbRef = fireStoreDb.collection('stripe_customers');
  const customer = (await dbRef.doc(user.uid).get()).data();
  if (customer) {
    await stripe.customers.del(customer.customer_id);
    // Delete the customers payments & payment methods in firestore.
    const batch = fireStoreDb.batch();
    const paymetsMethodsSnapshot = await dbRef
      .doc(user.uid)
      .collection('payment_methods')
      .get();
    paymetsMethodsSnapshot.forEach((snap) => batch.delete(snap.ref));
    const paymentsSnapshot = await dbRef
      .doc(user.uid)
      .collection('payments')
      .get();
    paymentsSnapshot.forEach((snap) => batch.delete(snap.ref));

    await batch.commit();

    await dbRef.doc(user.uid).delete();
  }
  return;
});
