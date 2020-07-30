import { ShoppingCart } from 'shared/models/shopping-cart';
import { AppProduct } from 'shared/models/app-products';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Item {
  product: AppProduct,
  item: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return this.db.object<ShoppingCart>('/shopping-carts/' + cartId).valueChanges()
      .pipe(
        map(x => {
          return new ShoppingCart(x.items);
        })
      );
  }

  async addToCart(product: AppProduct) {
    this.updateItem(product, 1)
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  async removeFromCart(product: AppProduct) {
    this.updateItem(product, -1)
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: Date()
    })
  }

  private getItemRef(cartId: string, productId: string) {
    return this.db.object<any>('/shopping-carts/' + cartId + '/items/' + productId)
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if(cartId) return cartId;
    
    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  private async updateItem(product: AppProduct, change: number) {
    let cartId = await this.getOrCreateCartId();
    let itemRef = this.getItemRef(cartId, product.key);
    itemRef.valueChanges().pipe(take(1)).subscribe(item => {
      let quantity = (item ? item.quantity : 0) + change;
      if(quantity === 0) itemRef.remove();
      else itemRef.update({
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: (item ? item.quantity : 0) + change,
      });
    })
  }
}
