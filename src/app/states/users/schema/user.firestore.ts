import { FirestoreService } from '@firebase/firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUserFirebaseModel } from './user.schema';
import { Injectable } from '@angular/core';
import { FireStoreSchemaService } from '../../../modules/firebase-state-helper/services/firestore-schema.service';

@Injectable({providedIn: 'root'})
export class UserFireStoreService extends FireStoreSchemaService<IUserFirebaseModel>{

  protected basePath = "users";
  
}
