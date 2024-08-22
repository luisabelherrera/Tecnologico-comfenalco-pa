import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profesor } from 'src/app/models/profesor';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private apiUrl = 'http://localhost:8086/api/profesores';

  constructor(private http: HttpClient) {}

  getAllProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.apiUrl);
  }

  getProfesorById(id: number): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.apiUrl}/${id}`);
  }

  createProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.post<Profesor>(`${this.apiUrl}/create`, profesor);
  }

  updateProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.put<Profesor>(`${this.apiUrl}/${profesor.id}`, profesor);
  }

  deleteProfesor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}