import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Periodo } from 'src/app/models/entity/Periodo.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PeriodoService {
       private apiUrl = `${environment.apiUrl}api/periodo`; 

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
    getPeriodosCount(): Observable<number> {
        try {
            return this.http.get<number>(`${this.apiUrl}/count`, { headers: this.getHeaders() })
                .pipe(catchError(this.handleError));
        } catch (error) {
            return throwError(() => new Error('Error obteniendo el número de periodos: ' + error));
        }
    }
    
    getPeriodosInactivos(): Observable<number> {
        try {
            return this.http.get<number>(`${this.apiUrl}/count/inactivos`, { headers: this.getHeaders() })
                .pipe(catchError(this.handleError));
        } catch (error) {
            return throwError(() => new Error('Error obteniendo el número de periodos inactivos: ' + error));
        }
    }
    
    getPeriodosActivos(): Observable<number> {
        try {
            return this.http.get<number>(`${this.apiUrl}/count/activos`, { headers: this.getHeaders() })
                .pipe(catchError(this.handleError));
        } catch (error) {
            return throwError(() => new Error('Error obteniendo el número de periodos activos: ' + error));
        }
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
