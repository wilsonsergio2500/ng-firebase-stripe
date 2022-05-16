import * as functions from "firebase-functions";
import * as firebaseAdmin from 'firebase-admin';

import * as Stripe from 'stripe';

firebaseAdmin.initializeApp();

export const stripeSecret = functions.config().stripe.secret;
export const stripe = new Stripe.Stripe(stripeSecret, { apiVersion: '2020-08-27' });

export const fireStoreDb = firebaseAdmin.firestore();
