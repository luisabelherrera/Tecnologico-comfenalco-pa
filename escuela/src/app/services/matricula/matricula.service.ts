import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/AuthService.service';
import { Inscripcion } from 'src/app/models/entity/Inscripcion.interface';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService { // Cambia el nombre aquí
  private apiUrl = 'http://localhost:8086/api/inscripciones'; // Cambia la URL aquí

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener el token desde localStorage
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
}

  // Obtener todas las inscripciones
  getAllInscripciones(): Observable<Inscripcion[]> { // Cambia el nombre aquí
    return this.http.get<Inscripcion[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Obtener una inscripción por ID
  getInscripcionById(id: number): Observable<Inscripcion> { // Cambia el nombre aquí
    return this.http.get<Inscripcion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Crear una nueva inscripción
  createInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> { // Cambia el nombre aquí
    return this.http.post<Inscripcion>(this.apiUrl, inscripcion, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }


  // Actualizar una inscripción existente
  updateInscripcion(id: number, inscripcion: Inscripcion): Observable<Inscripcion> { // Cambia el nombre aquí
    return this.http.put<Inscripcion>(`${this.apiUrl}/${id}`, inscripcion, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Eliminar una inscripción
  deleteInscripcion(id: number): Observable<void> { // Cambia el nombre aquí
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }
  
    console.error('An error occurred:', errorMessage);
    return throwError(errorMessage);
  }
}
