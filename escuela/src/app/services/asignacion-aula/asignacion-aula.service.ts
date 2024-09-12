import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AsignacionAula } from 'src/app/models/AsignacionAula.interface';
import { AuthService } from '../auth/AuthService.service';  




@Injectable({
  providedIn: 'root'
})
export class AsignacionAulaService {
  private apiUrl = 'http://localhost:8086/api/asignaciones-aulas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllAsignacionesAulas(): Observable<AsignacionAula[]> {
    return this.http.get<AsignacionAula[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getAsignacionAulaById(id: number): Observable<AsignacionAula> {
    return this.http.get<AsignacionAula>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createAsignacionAula(asignacionAula: AsignacionAula): Observable<AsignacionAula> {
    return this.http.post<AsignacionAula>(this.apiUrl, asignacionAula, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateAsignacionAula(id: number, asignacionAula: AsignacionAula): Observable<AsignacionAula> {
    return this.http.put<AsignacionAula>(`${this.apiUrl}/${id}`, asignacionAula, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAsignacionAula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
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
