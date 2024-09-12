import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Departamento } from 'src/app/models/departamento';
import { AuthService } from '../auth/AuthService.service';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private baseUrl = 'http://localhost:8086/api/departamentos';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  getDepartamentoById(id: number): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  createDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.baseUrl, departamento, { headers: this.getHeaders() });
  }

  updateDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.baseUrl}/${departamento.id}`, departamento, { headers: this.getHeaders() });
  }

  deleteDepartamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 409) {
      return throwError(() => new Error('No se puede eliminar el departamento porque está siendo usado.'));
    }
    return throwError(() => new Error('Error inesperado al eliminar el departamento.'));
  }
}
