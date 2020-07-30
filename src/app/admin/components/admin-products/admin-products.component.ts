import { ProductService } from 'shared/services/product.service';
import { AppProduct } from 'shared/models/app-products';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  products: AppProduct[];
  filterProducts: any;
  subscription: Subscription;

  constructor(private productService: ProductService) {
    this.subscription = productService.getAll()
      .subscribe(products => this.filterProducts = this.products = products);
  }

  filter(query: string) {
    this.filterProducts = (query) ? 
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
