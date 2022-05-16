import { IFireBaseEntity } from "@firebase/schema/base-schema";

export interface IStripeCustomersFirebaseModel extends IFireBaseEntity {
  id?: string;
  customer_id: string;
  setup_secret: string;
}


