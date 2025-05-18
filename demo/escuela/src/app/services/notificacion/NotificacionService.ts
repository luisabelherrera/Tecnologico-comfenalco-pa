import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Notificacion {
    id?: string;
    titulo: string;
    mensaje: string;
    leida: boolean;
    fechaHora: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    private apiUrl = `${environment.apiUrl}api/notificaciones`;

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken');
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }

    notificarAdministrador(notificacion: Partial<Notificacion>): Observable<Notificacion> {
        const payload: Partial<Notificacion> = {
            titulo: notificacion.titulo || 'Notificación',
            mensaje: notificacion.mensaje,
            leida: notificacion.leida ?? false,
            fechaHora: notificacion.fechaHora || new Date().toISOString()
        };
        return this.http.post<Notificacion>(this.apiUrl, payload, { headers: this.getHeaders() })
            .pipe(
                map(response => ({
                    ...response,
                    id: String(response.id) // Convertir Long a string
                })),
                catchError(this.handleError)
            );
    }

    obtenerNotificaciones(): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(this.apiUrl, { headers: this.getHeaders() })
            .pipe(
                map(notificaciones => notificaciones.map(n => ({
                    ...n,
                    id: String(n.id) // Convertir Long a string
                }))),
                catchError(this.handleError)
            );
    }

    marcarComoLeida(id: string): Observable<void> {
        const url = `${this.apiUrl}/${id}/marcar-como-leida`;
        return this.http.patch<void>(url, null, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    eliminarNotificacion(id: string): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        let errorMessage = 'Error inesperado: ';
        if (error.status === 401) {
            errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (error.status === 400) {
            errorMessage = 'Datos inválidos. Verifica los campos enviados.';
        } else if (error.error instanceof ErrorEvent) {
            errorMessage += error.error.message;
        } else {
            errorMessage += `Código ${error.status}: ${error.message}`;
        }
        console.error('Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}