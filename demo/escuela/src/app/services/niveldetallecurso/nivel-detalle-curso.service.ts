import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NivelDetalleCurso } from 'src/app/models/entity/NivelDetalleCurso.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NivelDetalleCursoService {
      private apiUrl = `${environment.apiUrl}api/nivel-detalle-curso`;

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getAll(): Observable<NivelDetalleCurso[]> {
        return this.http.get<NivelDetalleCurso[]>(this.apiUrl, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    getById(id: number): Observable<NivelDetalleCurso> {
        return this.http.get<NivelDetalleCurso>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    create(nivelDetalleCurso: NivelDetalleCurso): Observable<NivelDetalleCurso> {
        return this.http.post<NivelDetalleCurso>(this.apiUrl, nivelDetalleCurso, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    update(id: number, nivelDetalleCurso: NivelDetalleCurso): Observable<NivelDetalleCurso> {
        return this.http.put<NivelDetalleCurso>(`${this.apiUrl}/${id}`, nivelDetalleCurso, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return throwError(() => new Error('Error inesperado: ' + error.message || 'Error desconocido'));
    }
}
