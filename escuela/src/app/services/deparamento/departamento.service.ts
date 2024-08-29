import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Departamento } from 'src/app/models/departamento';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private baseUrl = 'http://localhost:8086/api/departamentos';

  constructor(private http: HttpClient) { }

  getAllDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.baseUrl);
  }

  getDepartamentoById(id: number): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.baseUrl}/${id}`);
  }

  createDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.baseUrl, departamento);
  }

  updateDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.baseUrl}/${departamento.id}`, departamento);
  }

  deleteDepartamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
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
