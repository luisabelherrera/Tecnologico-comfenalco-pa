import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  productData = { name: '' };

  constructor(private productService: ProductService) {}

  saveProduct() {
    this.productService.saveProduct(this.productData).subscribe(response => {
      console.log('Producto guardado:', response);
    }, error => {
      console.error('Error al guardar el producto:', error);
    });
  }
}
