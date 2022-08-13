import { IPaymentMethodFireStoreModel } from './payment-method.schema';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@firebaseNgxs/services/firestore.service';

@Injectable({ providedIn: "root"})
export class PaymentMethodFireStoreService extends FirestoreService<IPaymentMethodFireStoreModel>{

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
