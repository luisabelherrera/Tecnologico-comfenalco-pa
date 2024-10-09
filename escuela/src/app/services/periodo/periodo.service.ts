import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Periodo } from 'src/app/models/entity/Periodo.interface';

@Injectable({
    providedIn: 'root'
})
export class PeriodoService {
    private apiUrl = 'http://localhost:8086/api/periodo'; // Cambia esto a la URL de tu API

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }
    getAll(): Observable<Periodo[]> {
        return this.http.get<Periodo[]>(this.apiUrl, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }
    

    getById(id: number): Observable<Periodo> {
        return this.http.get<Periodo>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    create(periodo: Periodo): Observable<Periodo> {
        return this.http.post<Periodo>(this.apiUrl, periodo, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    update(id: number, periodo: Periodo): Observable<Periodo> {
        return this.http.put<Periodo>(`${this.apiUrl}/${id}`, periodo, { headers: this.getHeaders() })
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
