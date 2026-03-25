import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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
        return this.http.get<number>(`${this.apiUrl}/count`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }
    
    getPeriodosInactivos(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/count/inactivos`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }
    
    getPeriodosActivos(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/count/activos`, { headers: this.getHeaders() })
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

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
          // return an observable with a user-facing error message
          return throwError(
            'Something bad happened; please try again later.');
    }
}