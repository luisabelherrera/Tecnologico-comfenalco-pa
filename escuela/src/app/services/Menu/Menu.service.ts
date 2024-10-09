
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Menu } from 'src/app/models/entity/Menu.interface';


@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private apiUrl = 'http://localhost:8086/api/menu'; 

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getAll(): Observable<Menu[]> {
        return this.http.get<Menu[]>(this.apiUrl, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    getById(id: number): Observable<Menu> {
        return this.http.get<Menu>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    create(menu: Menu): Observable<Menu> {
        return this.http.post<Menu>(this.apiUrl, menu, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    update(id: number, menu: Menu): Observable<Menu> {
        return this.http.put<Menu>(`${this.apiUrl}/${id}`, menu, { headers: this.getHeaders() })
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
