import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante } from 'src/app/models/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = 'http://localhost:8086/api/estudiantes';

  constructor(private http: HttpClient) {}

  getAllEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  getEstudianteById(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`);
  }

  createEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, estudiante);
  }

  updateEstudiante(id: number, estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, estudiante);
  }

  deleteEstudiante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}