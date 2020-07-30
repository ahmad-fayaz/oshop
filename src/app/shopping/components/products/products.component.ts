import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { switchMap } from 'rxjs/operators';
import { AppProduct } from 'shared/models/app-products';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'shared/services/product.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCart } from 'shared/models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: AppProduct[] = [];
  filteredProducts: AppProduct[] = [];
  category;
  cart$: Observable<ShoppingCart>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService) {}

  populateProducts() {
    this.productService.getAll().pipe(
      switchMap(products => {
        this.products = products
        return this.route.queryParamMap;
      }))
      .subscribe(params => {
        this.category = params.get('category');
        this.applyFilter();
      });
  }

  applyFilter() {
    this.filteredProducts = (this.category) ? 
    this.products.filter(p => p.category === this.category) :
    this.products;
  }

  async ngOnInit() {
    this.populateProducts();
    this.cart$ = await this.shoppingCartService.getCart();
  }

}
