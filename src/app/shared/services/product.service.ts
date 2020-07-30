import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(product) {
    return this.db.list('/products').push(product);
  }

  getAll() {
    return this.db.list<any>('/products').snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  get(productId) {
    return this.db.object<any>('/products/' + productId).valueChanges();
  }

  update (productI, product) {
    return this.db.object('/products/' + productI).update(product);
  }

  delete(productId) {
    return this.db.object('/products/' + productId).remove();
  }
}
