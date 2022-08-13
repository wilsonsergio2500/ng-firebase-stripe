import { Injectable } from '@angular/core';
import { FirestoreService } from '@firebaseNgxs/services/firestore.service';
import { IPaymentFireStoreModel } from './payment.schema';

@Injectable({
  providedIn: 'root'
})
export class PaymentFireStoreService extends FirestoreService<IPaymentFireStoreModel>{

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
