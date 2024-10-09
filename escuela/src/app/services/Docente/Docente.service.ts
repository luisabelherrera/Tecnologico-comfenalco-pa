import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Docente } from 'src/app/models/entity/docente.model';


@Injectable({
    providedIn: 'root'
})
export class DocenteService {
    private apiUrl = 'http://localhost:8086/api/docentes'; 

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getAllDocentes(): Observable<Docente[]> {
        return this.http.get<Docente[]>(this.apiUrl, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    getById(id: number): Observable<Docente> {
        return this.http.get<Docente>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    create(docente: Docente): Observable<Docente> {
        return this.http.post<Docente>(this.apiUrl, docente, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    update(id: number, docente: Docente): Observable<Docente> {
        return this.http.put<Docente>(`${this.apiUrl}/${id}`, docente, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 401) {
            return throwError(() => new Error('No autorizado. Verifica tus credenciales.'));
        }
        if (error.status === 404) {
            return throwError(() => new Error('Recurso no encontrado.'));
        }
        return throwError(() => new Error('Error inesperado.'));
    }
}
