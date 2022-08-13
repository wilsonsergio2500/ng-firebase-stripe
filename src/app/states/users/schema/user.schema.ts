import { IFireBaseEntity } from "@firebaseNgxs/schema/base-schema";

export interface IUserFirebaseModel extends IFireBaseEntity {
  name?: string;
  lastName?: string;
  email: string;
  pic: string;
  bio: string;
  phoneNumber: string;
  photoURL: string;
  displayName: string;
}
