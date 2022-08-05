import { Injectable } from '@angular/core';
import { FireStoreSchemaService } from '../../../../modules/firebase-state-helper/services/firestore-schema.service';
import { IPaymentFireStoreModel } from './payment.schema';

@Injectable({
  providedIn: 'root'
})
export class PaymentFireStoreService extends FireStoreSchemaService<IPaymentFireStoreModel>{

  private _customerId = '';

  protected get basePath() {
    return `stripe_customers/${this.customerId}/payments`;
  };
  protected indexField: 'id';

  public setCustomer(customerId: string) {
    this._customerId = customerId;
  }

  public get customerId() {
    return this._customerId;
  }

}
