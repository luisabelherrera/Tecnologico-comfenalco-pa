import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Nivel } from 'src/app/models/entity/nivel.interface';
import { Periodo } from 'src/app/models/entity/Periodo.interface';

@Injectable({
    providedIn: 'root'
})
export class NivelService {
    private apiUrl = 'http://localhost:8086/api/nivel'; // Cambia esto a la URL de tu API

    constructor(private http: HttpClient) {}

    // Configura las cabeceras de la solicitud
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    // Obtener todos los niveles
    getAll(): Observable<Nivel[]> {
        return this.http.get<Nivel[]>(this.apiUrl, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError)); // Manejo de errores
    }

    // Obtener un nivel por ID
    getById(id: number): Observable<Nivel> {
        return this.http.get<Nivel>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }
// En NivelService

createPeriodo(periodo: Periodo): Observable<Periodo> {
    return this.http.post<Periodo>(`${this.apiUrl}/periodos`, periodo, { headers: this.getHeaders() })
        .pipe(catchError(this.handleError));
}

    // Crear un nuevo nivel
    create(nivel: Nivel): Observable<Nivel> {
        return this.http.post<Nivel>(this.apiUrl, nivel, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    // Actualizar un nivel existente
    update(id: number, nivel: Nivel): Observable<Nivel> {
        return this.http.put<Nivel>(`${this.apiUrl}/${id}`, nivel, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    // Eliminar un nivel por ID
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    // Manejo de errores
    private handleError(error: any): Observable<never> {
        let errorMessage = 'Error inesperado';

        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Error del lado del servidor
            errorMessage = `Código de error: ${error.status}\nMensaje: ${error.error.message || error.message}`;
        }

        console.error(errorMessage); // Log para depuración
        return throwError(() => new Error(errorMessage)); // Lanza el error para su manejo posterior
    }
}
