import { Injectable } from '@angular/core';
import { FireStoreSchemaService } from '../../../../modules/firebase-state-helper/services/firestore-schema.service';
import { IStripePaymentMethodFirebaseModel } from './stripe-payment-methods.schema';

@Injectable({
  providedIn: 'root'
})
export class StripePaymentMethodsFireStoreService extends FireStoreSchemaService<IStripePaymentMethodFirebaseModel>{

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
