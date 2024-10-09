import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SubMenu } from 'src/app/models/entity/SubMenu.interface';

@Injectable({
  providedIn: 'root'
})
export class SubMenuService {
  private apiUrl = 'http://localhost:8086/api/submenu'; // Cambia esto a la URL de tu API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<SubMenu[]> {
    return this.http.get<SubMenu[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<SubMenu> {
    return this.http.get<SubMenu>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  create(subMenu: SubMenu): Observable<SubMenu> {
    return this.http.post<SubMenu>(this.apiUrl, subMenu, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  update(id: number, subMenu: SubMenu): Observable<SubMenu> {
    return this.http.put<SubMenu>(`${this.apiUrl}/${id}`, subMenu, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(() => new Error('Error inesperado: ' + error));
  }
}
