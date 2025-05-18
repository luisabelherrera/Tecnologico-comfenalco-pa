import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    private apiUrl = `${environment.apiUrl}api/notificaciones`;

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json'
        });
    }

    notificarAdministrador(titulo: string, mensaje: string): Observable<any> {
        const payload = {
            titulo: titulo,
            mensaje: mensaje,
            leida: false,
            fechaHora: new Date().toISOString().slice(0, 19) // e.g., "2025-05-18T17:55:00"
        };
        console.log('Sending notification:', payload);
        return this.http.post<any>(this.apiUrl, payload, { headers: this.getHeaders() })
            .pipe(
                map(response => {
                    console.log('Response:', response);
                    return response;
                }),
                catchError(this.handleError)
            );
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
        } else if (error.status === 400) {
            errorMessage = `Error de validación: ${error.error}`;
        } else if (error.error instanceof ErrorEvent) {
            errorMessage += error.error.message;
        } else {
            errorMessage += `Código ${error.status}: ${error.message}`;
        }
        console.error('Error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
    }
}