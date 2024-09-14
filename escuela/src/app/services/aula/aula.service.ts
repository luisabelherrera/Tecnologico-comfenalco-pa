import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Aula } from 'src/app/models/aula';
import { AuthService } from '../auth/AuthService.service';  
@Injectable({
  providedIn: 'root'
})
export class AulaService {
  private apiUrl = 'http://localhost:8086/api/aulas';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getAulaById(id: number): Observable<Aula> {
    return this.http.get<Aula>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createAula(aula: Aula): Observable<Aula> {
    console.log('Creating Aula:', aula); 
    return this.http.post<Aula>(this.apiUrl, aula, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
  

  updateAula(aula: Aula): Observable<Aula> {
    return this.http.put<Aula>(`${this.apiUrl}/${aula.id}`, aula, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Maneja errores específicos según sea necesario
    if (error.status === 401) {
      return throwError(() => new Error('No autorizado. Verifica tus credenciales.'));
    }
    if (error.status === 404) {
      return throwError(() => new Error('Recurso no encontrado.'));
    }
    return throwError(() => new Error('Error inesperado.'));
  }
}
