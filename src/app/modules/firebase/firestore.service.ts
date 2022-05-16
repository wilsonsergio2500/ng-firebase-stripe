import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, QueryFn } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

export abstract class FirestoreService<T> {

  protected abstract basePath: string;
  constructor(protected firestore: AngularFirestore) { }

  doc$(id: string): Observable<T> {
    return this.firestore.doc<T>(`${this.basePath}/${id}`).valueChanges().pipe(
      tap(r => {
        if (!environment.production) {
          console.groupCollapsed(`Firestore Streaming [${this.basePath}] [doc$] ${id}`)
          console.log(r)
          console.groupEnd()
        }
      }),
    );
  }

  collection$(queryFn?: QueryFn): Observable<T[]> {
    return this.firestore.collection<T>(`${this.basePath}`, queryFn).valueChanges().pipe(
      tap(r => {
        if (!environment.production) {
          console.groupCollapsed(`Firestore Streaming [${this.basePath}] [collection$]`)
          console.table(r)
          console.groupEnd()
        }
      }),
    );
  }

  create(value: T, id = this.firestore.createId()) {
    const payload = Object.assign({}, { id }, value);
    return this.collection.doc(id).set(payload).then(_ => {
      if (!environment.production) {
        console.groupCollapsed(`Firestore Service [${this.basePath}] [create] [${id}]`)
        console.log('[Id]', id, value)
        console.groupEnd()
      }
      return payload as T;
    })
  }

  merge<T2>(path: string[], value: T | T2) {
    const docPath = path.length > 1 ? path.join('/') : path[0];
    const payload = { ...value }
    return this.collection.doc(docPath).set(payload, { merge: true }).then(_ => {
      if (!environment.production) {
        console.groupCollapsed(`Firestore Service [${this.basePath}] [merge] [doc:${docPath}]`)
        console.log(`[${docPath}]`, value)
        console.groupEnd()
      }
      return payload as T;
    })
  }

  update(value: T, id: string) {
    return this.firestore.doc<T>(`${this.basePath}/${id}`).update({ ...value }).then(_ => {
      if (!environment.production) {
        console.groupCollapsed(`Firestore Service [${this.basePath}] [update] [${id}]`)
        console.log('[Id]', id, value)
        console.groupEnd()
      }
    })
  }

  delete(id: string) {
    return this.collection.doc(id).delete().then(_ => {
      if (!environment.production) {
        console.groupCollapsed(`Firestore Service [${this.basePath}] [delete]`)
        console.log('[Id]', id)
        console.groupEnd()
      }
    })
  }
  

  subCollection$<TTypeOfSubCollection = T>(doc: string, collection: string, queryFn?: QueryFn) {
    return this.collection.doc(doc).collection<TTypeOfSubCollection>(collection, queryFn).valueChanges().pipe(
      tap(r => {
        if (!environment.production) {
          console.groupCollapsed(`Firestore Streaming [${this.basePath}] [subCollection$] [doc:${doc}] [collection:${collection}]`)
          console.table(r)
          console.groupEnd()
        }
      })
    );
  }

  subDocRef(path: string[]) {
    return this.collection.doc(path.length > 1 ? path.join('/') : path[0])
  }

  queryCollection(queryFn?: QueryFn) {
    return this.firestore.collection<T>(`${this.basePath}`, queryFn);
  }

  queryPath(doc: string, collection: string, queryFn?: QueryFn) {
    return this.collection.doc(doc).collection<T>(collection, queryFn);
  }



  private get collection() {
    return this.firestore.collection(`${this.basePath}`);
  }


}
