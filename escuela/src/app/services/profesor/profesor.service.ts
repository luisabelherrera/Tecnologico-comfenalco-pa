
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profesor } from 'src/app/models/profesor';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private baseUrl = 'http://localhost:8086/api/profesores';

  constructor(private http: HttpClient) { }

  getAllProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.baseUrl);
  }

  getProfesorById(id: number): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.baseUrl}/${id}`);
  }

  createProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.post<Profesor>(`${this.baseUrl}`, profesor);
  }

  updateProfesor(id: number, profesor: Profesor): Observable<Profesor> {
    return this.http.put<Profesor>(`${this.baseUrl}/${id}`, profesor);
  }

  deleteProfesor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}