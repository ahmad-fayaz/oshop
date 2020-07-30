import { CategoryService } from 'shared/services/category.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { AppProduct } from 'shared/models/app-products';
import { ProductService } from 'shared/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {

  categories$: Observable<any[]>;

  product: AppProduct = {
    key: '',
    category: '',
    imageUrl: '',
    price: null,
    title: '',
  };

  id;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService) {

    this.categories$ = categoryService.getAll();
    
    this.id = route.snapshot.paramMap.get('id');
    if(this.id) productService.get(this.id).pipe(take(1)).subscribe(p => this.product = p);
  }

  save(product) {
    if(this.id) this.productService.update(this.id, product);
    else this.productService.create(product);

    this.router.navigate(['/admin/products']);
  }

  delete() {
    if(!confirm('Are you sure you want to delete this product?')) return;
    
    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);
  }

}
