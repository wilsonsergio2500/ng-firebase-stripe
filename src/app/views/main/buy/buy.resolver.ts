import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { StripeCustomersLoadPaymentMethodsAction } from "@states/stripe/customers/stripe-customers.actions";

@Injectable()
export class BuyComponentResolver implements Resolve<void>{

  constructor(private store: Store) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void | Observable<void> | Promise<void> {
/*    this.store.dispatch(new StripeCustomersLoadPaymentMethodsAction())*/
    return;
  }
}
