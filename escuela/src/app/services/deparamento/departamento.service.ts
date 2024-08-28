
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.post<Departamento>(`${this.baseUrl}/create`, departamento);
  }

  updateDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.baseUrl}/${departamento.id}`, departamento);
  }

  deleteDepartamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
