import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080'; // Cambia la URL según tu backend

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/public/product`);
  }

  saveProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/saveproduct`, product);
  }
}
