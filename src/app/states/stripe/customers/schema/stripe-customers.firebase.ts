import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@firebase/firestore.service';
import { IStripeCustomersFirebaseModel } from './stripe-customers.schema';

export class StripeCustomersFireStore extends FirestoreService<IStripeCustomersFirebaseModel>{

    protected basePath = "stripe_customers";
    constructor(angularFireStore: AngularFirestore) {
        super(angularFireStore);
    }

}
