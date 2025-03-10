import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Acudiente } from 'src/app/models/entity/Acudiente.interface';
import { AuthService } from '../auth/AuthService.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcudienteService {
  private apiUrl = `${environment.apiUrl}api/acudientes`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAcudientes(page: number, size: number, nombres?: string, documentoIdentidad?: string): Observable<any> {
    let url = `${this.apiUrl}/acudientes?page=${page}&size=${size}`;
    if (nombres) url += `&nombres=${encodeURIComponent(nombres)}`;
    if (documentoIdentidad) url += `&documentoIdentidad=${encodeURIComponent(documentoIdentidad)}`;

    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  getAcudienteById(id: number): Observable<Acudiente> {
    return this.http.get<Acudiente>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createAcudiente(acudiente: Acudiente): Observable<Acudiente> {
    return this.http.post<Acudiente>(this.apiUrl, acudiente, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateAcudiente(id: number, acudiente: Acudiente): Observable<Acudiente> {
    return this.http.put<Acudiente>(`${this.apiUrl}/${id}`, acudiente, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAcudiente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      return throwError(() => new Error('Error de red o servidor no disponible.'));
    }
    if (error.status === 401) {
      return throwError(() => new Error('No autorizado. Verifica tus credenciales.'));
    }
    if (error.status === 403) {
      return throwError(() => new Error('Acceso denegado. No tienes permisos.'));
    }
    if (error.status === 404) {
      return throwError(() => new Error('Recurso no encontrado.'));
    }
    return throwError(() => new Error('Error inesperado. Intenta de nuevo.'));
  }
}