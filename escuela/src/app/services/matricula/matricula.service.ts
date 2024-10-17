import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/AuthService.service';
import { Inscripcion } from 'src/app/models/entity/Inscripcion.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private apiUrl = `${environment.apiUrl}api/inscripciones`; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
}

getAllInscripciones(): Observable<Inscripcion[]> {
  return this.http.get<Inscripcion[]>(this.apiUrl, { headers: this.getHeaders() })
    .pipe(catchError(this.handleError));
}

  getInscripcionById(id: number): Observable<Inscripcion> {
    return this.http.get<Inscripcion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(this.apiUrl, inscripcion, { headers: this.getHeaders() })
        .pipe(catchError(this.handleError));
}

  updateInscripcion(id: number, inscripcion: Inscripcion): Observable<Inscripcion> { 
    return this.http.put<Inscripcion>(`${this.apiUrl}/${id}`, inscripcion, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }


  deleteInscripcion(id: number): Observable<void> { 
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
