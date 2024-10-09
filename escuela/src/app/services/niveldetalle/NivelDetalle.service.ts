// src/app/services/nivel-detalle.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NivelDetalle } from 'src/app/models/entity/NivelDetalle.interface';

@Injectable({
    providedIn: 'root'
})
export class NivelDetalleService {
    private apiUrl = 'http://localhost:8086/api/nivel-detalle'; // Cambia esto a la URL de tu API

    constructor(private http: HttpClient) {}

    // Método privado para obtener los encabezados HTTP
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    // Obtener todos los NivelDetalle
    getAll(): Observable<NivelDetalle[]> {
        return this.http.get<NivelDetalle[]>(this.apiUrl, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    // Obtener un NivelDetalle por ID
    getById(id: number): Observable<NivelDetalle> {
        return this.http.get<NivelDetalle>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    // Crear un nuevo NivelDetalle
    create(nivelDetalle: NivelDetalle): Observable<NivelDetalle> {
        return this.http.post<NivelDetalle>(this.apiUrl, nivelDetalle, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    // Actualizar un NivelDetalle existente
    update(id: number, nivelDetalle: NivelDetalle): Observable<NivelDetalle> {
        return this.http.put<NivelDetalle>(`${this.apiUrl}/${id}`, nivelDetalle, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    // Eliminar un NivelDetalle
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    // Manejo de errores
    private handleError(error: any) {
        console.error('Ocurrió un error:', error);
        return throwError(() => new Error('Error inesperado: ' + error.message || error));
    }
}
