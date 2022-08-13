import { ICustomerFireStoreModel } from './customer.schema';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@firebase/services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerFireStoreService extends FirestoreService<ICustomerFireStoreModel>{

  protected basePath = "stripe_customers";

}
