import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private apiUrl = `${environment.apiUrl}api/notificaciones`;

  constructor(private http: HttpClient) {}

 private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || ''}` // Handle null token
        });
    }

  notificarAdministrador(mensaje: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { mensaje }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  marcarComoLeida(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/marcar-como-leida`;
    return this.http.patch<any>(url, null, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  eliminarNotificacion(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  obtenerNotificaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = 'Error inesperado: ';
    if (error.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
      // Optionally trigger logout here
    } else if (error.error instanceof ErrorEvent) {
      errorMessage += error.error.message;
    } else {
      errorMessage += `Código ${error.status}: ${error.message}`;
    }
    console.error('Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}