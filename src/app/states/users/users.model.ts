import { IFirebasePaginationState } from "@firebase/paginations/firebase-pagination";
import { IUserFirebaseModel } from "./schema/user.schema";

export interface IUsersStateModel {
  working: boolean;
  users: IUserFirebaseModel[];
  size: number;
  paginationState: IFirebasePaginationState<IUserFirebaseModel>;
}
