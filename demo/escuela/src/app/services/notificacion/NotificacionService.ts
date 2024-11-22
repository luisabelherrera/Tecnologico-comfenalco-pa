import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    private apiUrl = `${environment.apiUrl}api/notificaciones`; 

    constructor(private http: HttpClient) {}

    notificarAdministrador(mensaje: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { mensaje })
            .pipe(catchError(this.handleError)); 
    }
    marcarComoLeida(id: string): Observable<any> {
        const url = `${this.apiUrl}/${id}/marcar-como-leida`; 
        return this.http.patch<any>(url, null)
          .pipe(catchError(this.handleError)); 
      }
      eliminarNotificacion(id: string): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<any>(url).pipe(
          catchError((error) => {
            console.error('Error al eliminar la notificación:', error);
            return throwError(() => new Error('Error al eliminar la notificación.'));
          })
        );
      }
      
    obtenerNotificaciones(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(catchError(this.handleError));
      }
    // Manejo de errores
    private handleError(error: any) {
        let errorMessage = 'Error inesperado: ';
        if (error.error instanceof ErrorEvent) {
            errorMessage += error.error.message;
        } else {
            errorMessage += `Código ${error.status}: ${error.message}`;
        }
        console.error('Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
