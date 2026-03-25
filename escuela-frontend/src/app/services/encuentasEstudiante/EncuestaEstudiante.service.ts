import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EncuestaEstudiante } from 'src/app/models/entity/EncuestaEstudiante.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncuestaEstudianteService {
  private apiUrl = `${environment.apiUrl}api/encuestas`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getEncuestaById(id: number): Observable<EncuestaEstudiante> {
    return this.http.get<EncuestaEstudiante>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getEncuestaByEstudianteId(estudianteId: number): Observable<EncuestaEstudiante> {
    return this.http.get<EncuestaEstudiante>(`${this.apiUrl}/estudiante/${estudianteId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createEncuesta(encuesta: EncuestaEstudiante): Observable<EncuestaEstudiante> {
    console.log('Enviando al backend:', encuesta); // Verifica qué se envía
    return this.http.post<EncuestaEstudiante>(this.apiUrl, encuesta, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateEncuesta(id: number, encuesta: EncuestaEstudiante): Observable<EncuestaEstudiante> {
    console.log('Actualizando en backend:', encuesta);
    return this.http.put<EncuestaEstudiante>(`${this.apiUrl}/${id}`, encuesta, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  deleteEncuesta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllEncuestas(): Observable<EncuestaEstudiante[]> {
    return this.http.get<EncuestaEstudiante[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error); // Log the entire error object
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }

    if (error.status === 0) {
      return throwError(() => new Error('Error de red o servidor no disponible.'));
    } else if (error.status === 401) {
      return throwError(() => new Error('No autorizado. Verifica tus credenciales.'));
    } else if (error.status === 403) {
      return throwError(() => new Error('Acceso denegado. No tienes permisos.'));
    } else if (error.status === 404) {
      return throwError(() => new Error('Recurso no encontrado.'));
    }
    return throwError(() => new Error('Error inesperado. Intenta de nuevo.'));
  }
}