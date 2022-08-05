import { AngularFirestore } from '@angular/fire/firestore';
import { IPaymentMethodFireStoreModel } from './payment-method.schema';
import { Injectable } from '@angular/core';
import { FireStoreSchemaService } from '../../../../modules/firebase-state-helper/services/firestore-schema.service';

@Injectable({ providedIn: "root"})
export class PaymentMethodFireStoreService extends FireStoreSchemaService<IPaymentMethodFireStoreModel>{

  private _customerId = '';

  protected get basePath() {
    return `stripe_customers/${this.customerId}/payment_methods`;
  };
  protected indexField: 'id';

  public setCustomer(customerId: string) {
    this._customerId = customerId;
  }

  public get customerId() {
    return this._customerId;
  }

}
