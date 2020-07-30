import { AppProduct } from './app-products';
import { ShoppingCartItem } from "./shoping-cart-item";

export class ShoppingCart {
    itemsArray: ShoppingCartItem[] = [];
    constructor(public items: { [productId: string]: ShoppingCartItem }) {
        this.items = items || {};

        for(let productId in items) {
            let item = this.items[productId];
            this.itemsArray.push(new ShoppingCartItem({...item, key: productId}));
        }
        
    }

    getQuantity(product: AppProduct) {
        let item = this.items[product.key];
        return item ? item.quantity : 0;
      }

    get totalPrice() {
        let sum = 0;
        for(let index in this.itemsArray) {
            sum += this.itemsArray[index].totalPrice;
        }
        return sum;
    }

    get totalItemsCount() {
        let count = 0;
        for(let productId in this.items) {
            count += this.items[productId].quantity;
        }
        return count;
    }
}