import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private apiUrl = `${environment.apiUrl}api/calificaciones`;


  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCalificaciones(): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getCalificacionById(id: number): Observable<Calificacion> {
    return this.http.get<Calificacion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createCalificacion(calificacion: Calificacion): Observable<Calificacion> {
    return this.http.post<Calificacion>(this.apiUrl, calificacion, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateCalificacion(id: number, calificacion: Calificacion): Observable<Calificacion> {
    console.log('Actualizando calificación:', calificacion);
    return this.http.put<Calificacion>(`${this.apiUrl}/${id}`, calificacion, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
}

  deleteCalificacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Error occurred:', error);
    return throwError(() => new Error('Error en la operación. Inténtalo de nuevo más tarde.'));
  }
}
