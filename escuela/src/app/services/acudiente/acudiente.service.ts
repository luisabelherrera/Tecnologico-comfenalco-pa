import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Acudiente } from 'src/app/models/entity/Acudiente.interface';
import { AuthService } from '../auth/AuthService.service';  // Si necesitas usar AuthService

@Injectable({
  providedIn: 'root'
})
export class AcudienteService {
  private apiUrl = 'http://localhost:8086/api/acudientes';  // Ajusta esta URL según tu backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener el token desde localStorage
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Método para obtener todos los acudientes
  getAcudientes(): Observable<Acudiente[]> {
    return this.http.get<Acudiente[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener un acudiente por ID
  getAcudienteById(id: number): Observable<Acudiente> {
    return this.http.get<Acudiente>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para crear un nuevo acudiente
  createAcudiente(acudiente: Acudiente): Observable<Acudiente> {
    return this.http.post<Acudiente>(this.apiUrl, acudiente, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para actualizar un acudiente existente
  updateAcudiente(id: number, acudiente: Acudiente): Observable<Acudiente> {
    return this.http.put<Acudiente>(`${this.apiUrl}/${id}`, acudiente, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para eliminar un acudiente
  deleteAcudiente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
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
