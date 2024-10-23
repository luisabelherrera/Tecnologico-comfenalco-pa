import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Nivel } from 'src/app/models/entity/nivel.interface';
import { Periodo } from 'src/app/models/entity/Periodo.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NivelService {
       private apiUrl = `${environment.apiUrl}api/nivel`; 
    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getAll(): Observable<Nivel[]> {
        return this.http.get<Nivel[]>(this.apiUrl, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    getById(id: number): Observable<Nivel> {
        return this.http.get<Nivel>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

createPeriodo(periodo: Periodo): Observable<Periodo> {
    return this.http.post<Periodo>(`${this.apiUrl}/periodos`, periodo, { headers: this.getHeaders() })
        .pipe(catchError(this.handleError));
}

    create(nivel: Nivel): Observable<Nivel> {
        return this.http.post<Nivel>(this.apiUrl, nivel, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    update(id: number, nivel: Nivel): Observable<Nivel> {
        return this.http.put<Nivel>(`${this.apiUrl}/${id}`, nivel, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any): Observable<never> {
        let errorMessage = 'Error inesperado';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Código de error: ${error.status}\nMensaje: ${error.error.message || error.message}`;
        }

        console.error(errorMessage); 
        return throwError(() => new Error(errorMessage));
    }
}
