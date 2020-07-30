import { Observable } from 'rxjs';
import { ShoppingCartService } from './shopping-cart.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private db: AngularFireDatabase,
    private shoppingCartService: ShoppingCartService) { }

  async placeOrder(order) {
    let result = await this.db.list('/orders').push(order);
    this.shoppingCartService.clearCart();
    return result;
  }
  
  getOrders() {
    return this.db.list("/orders").valueChanges();
  }

  getOrdersByUser(userId: string): Observable<any> {
    return this.db.list("/orders", query => {
      return query
              .orderByChild('userId')
              .equalTo(userId)
    })
    .valueChanges();
  }
}
