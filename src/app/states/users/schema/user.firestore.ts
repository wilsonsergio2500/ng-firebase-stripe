import { FirestoreService } from '@firebase/firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUserFirebaseModel } from './user.schema';

export class UserFireStore extends FirestoreService<IUserFirebaseModel>{

  protected basePath = "users";
  constructor(angularFireStore: AngularFirestore) {
    super(angularFireStore);
  }
}
