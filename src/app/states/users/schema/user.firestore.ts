import { IUserFirebaseModel } from './user.schema';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@firebase/services/firestore.service';

@Injectable({providedIn: 'root'})
export class UserFireStoreService extends FirestoreService<IUserFirebaseModel>{

  protected basePath = "users";
  
}
