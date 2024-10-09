import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DocenteNivelDetalleCurso } from 'src/app/models/entity/docente-nivel-detalle-curso.model';

@Injectable({
    providedIn: 'root'
})
export class DocenteNivelDetalleCursoService {
  private apiUrl = 'http://localhost:8086/api/docente-nivel-detalle-curso';

  
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('accessToken');
      if (!token) {
          throw new Error('Token de acceso no encontrado.');
      }
      return new HttpHeaders({
          'Authorization': `Bearer ${token}`
      });
  }

  getAll(): Observable<DocenteNivelDetalleCurso[]> {
      return this.http.get<DocenteNivelDetalleCurso[]>(this.apiUrl, { headers: this.getHeaders() })
          .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<DocenteNivelDetalleCurso> {
      return this.http.get<DocenteNivelDetalleCurso>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
          .pipe(catchError(this.handleError));
  }

  create(docenteNivelDetalleCurso: DocenteNivelDetalleCurso): Observable<DocenteNivelDetalleCurso> {
    return this.http.post<DocenteNivelDetalleCurso>(this.apiUrl, docenteNivelDetalleCurso, { headers: this.getHeaders() })
        .pipe(catchError((error: HttpErrorResponse) => {
            console.error('Error en la creación:', error); 
            return this.handleError(error);
        }));
}

  update(id: number, docenteNivelDetalleCurso: DocenteNivelDetalleCurso): Observable<DocenteNivelDetalleCurso> {
      return this.http.put<DocenteNivelDetalleCurso>(`${this.apiUrl}/${id}`, docenteNivelDetalleCurso, { headers: this.getHeaders() })
          .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
          .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Error inesperado.';

      if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
      } else {
          errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
      }

      return throwError(() => new Error(errorMessage));
  }
}