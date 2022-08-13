import { Inject, Injectable, Optional } from "@angular/core";
import { AngularFirestore, QueryFn } from "@angular/fire/firestore";
import { from, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { FIREBASE_STATE_CONFIG, INgxsStateHelperModuleConfig } from "../tokens/firebase-state-config.token";
import * as firebase from 'firebase'

@Injectable()
export abstract class FirestoreService<T>{


  protected abstract basePath: string;
  constructor(protected firestore: AngularFirestore,
    @Optional() @Inject(FIREBASE_STATE_CONFIG) private config: INgxsStateHelperModuleConfig) { }

  protected get collection() {
    return this.firestore.collection(`${this.basePath}`);
  }

  get fireStoreId() {
    return this.firestore.createId();
  }

  get loggerOn() {
    return this.config?.loggerOn ?? false;
  }

  protected log<T>(title: string, r: T[] | Partial<T>[]) {
    console.groupCollapsed(title);
    console.table(r);
    console.groupEnd();
  }

  doc$(id: string): Observable<T> {
    return this.firestore.doc<T>(`${this.basePath}/${id}`).valueChanges().pipe(
      tap(r => {
        if (this.loggerOn) {
          this.log(`Firestore Streaming [${this.basePath}] [doc$] ${id}`, [r]);
        }
      }),
    );
  }

  docOnce$(id: string, getOptions : firebase.default.firestore.GetOptions = { source: 'default' }) : Observable<T> {
    return this.firestore.doc<T>(`${this.basePath}/${id}`).get(getOptions).pipe(
      map(snapshot => {
        if (snapshot.exists) {
          const r = snapshot.data();
          if (this.loggerOn) {
            this.log(`Firestore Streaming [${this.basePath}] [docOnce$] ${id}`, [r]);
          }
          return r;
        }
        return null;
      })
    )
  }

  collection$(queryFn?: QueryFn): Observable<T[]> {
    return this.firestore.collection<T>(this.basePath, queryFn).valueChanges().pipe(
      tap(r => {
        if (this.loggerOn) {
          this.log(`Firestore Streaming [${this.basePath}] [collection$]`, r);
        }
      }),
    );
  }

  public collectionOnce$(queryFn: QueryFn = (ref) => ref, getOptions: firebase.default.firestore.GetOptions = { source: 'default' }): Observable<T[]> {
    return this.firestore.collection<T>(this.basePath, queryFn).get(getOptions)
      .pipe(
        map((snapshot) => {
          const snapshotDocs = snapshot.docs;
          const r = snapshotDocs.map((snapshotItem) => snapshotItem.data());
          if (!this.loggerOn) {
            this.log(`Firestore Streaming [${this.basePath}] [collectionOnce$]`, r);
          }
          return r;
        })
      );
  }

  public create(value: T, id = this.fireStoreId) : Observable<void> {
    const payload = Object.assign({}, { id }, value);
    return from(this.collection.doc(id).set(payload)).pipe(
      tap(() => {
        if (this.loggerOn) {
          this.log(`Firestore Streaming [${this.basePath}] [create] [${id}]`, [{ ...value, id }]);
        }
      })
    )
  }

  update(value: T, id?: string): Observable<void> {
    const docId = id || (value as unknown as {id: string})?.id
    return from(this.firestore.doc<T>(`${this.basePath}/${docId}`).update({ ...value })).pipe(
      tap(() => {
        if (this.loggerOn) {
          this.log(`Firestore Service [${this.basePath}] [update] [${docId}]`, [value])
        }
      })
    )
  }

  delete(id: string) : Observable<void> {
    return from(this.collection.doc(id).delete()).pipe(
      tap(() => {
        if (this.loggerOn) {
          this.log(`Firestore Service [${this.basePath}] [delete]`, [{id}])
        }
      })
    )
  }

  merge(value: T | Partial<T>, id?: string, setOptions: firebase.default.firestore.SetOptions = { merge: true }) {
    const docId = id || (value as unknown as { id: string })?.id
    return from(this.firestore.doc<T | Partial<T>>(`${this.basePath}/${docId}`).set({ ...value }, setOptions)).pipe(
      tap(() => {
        if (this.loggerOn) {
          this.log(`Firestore Service [${this.basePath}] [update] [${docId}]`, [value])
        }
      })
    )
  }

  queryCollection(queryFn?: QueryFn) {
    return this.firestore.collection<T>(`${this.basePath}`, queryFn);
  }


}
