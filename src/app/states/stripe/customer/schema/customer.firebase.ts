import { ICustomerFireStoreModel } from './customer.schema';
import { FireStoreSchemaService } from '../../../../modules/firebase-state-helper/services/firestore-schema.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerFireStoreService extends FireStoreSchemaService<ICustomerFireStoreModel>{

  protected basePath = "stripe_customers";

}
