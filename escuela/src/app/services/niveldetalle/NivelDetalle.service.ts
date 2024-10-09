
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NivelDetalle } from 'src/app/models/entity/NivelDetalle.interface';

@Injectable({
    providedIn: 'root'
})
export class NivelDetalleService {
    private apiUrl = 'http://localhost:8086/api/nivel-detalle'; 

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getAll(): Observable<NivelDetalle[]> {
        return this.http.get<NivelDetalle[]>(this.apiUrl, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    getById(id: number): Observable<NivelDetalle> {
        return this.http.get<NivelDetalle>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    create(nivelDetalle: NivelDetalle): Observable<NivelDetalle> {
        return this.http.post<NivelDetalle>(this.apiUrl, nivelDetalle, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }
    update(id: number, nivelDetalle: NivelDetalle): Observable<NivelDetalle> {
        return this.http.put<NivelDetalle>(`${this.apiUrl}/${id}`, nivelDetalle, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }
    private handleError(error: any) {
        console.error('Ocurrió un error:', error);
        return throwError(() => new Error('Error inesperado: ' + error.message || error));
    }
}
