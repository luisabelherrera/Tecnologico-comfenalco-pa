// src/app/services/desempeno-estudiante.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DesempenoEstudiante } from 'src/app/models/entity/desempeno-estudiante.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DesempenoEstudianteService {
  private apiUrl = `${environment.apiUrl}api/prediccion`; // URL dinámica desde environment

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<DesempenoEstudiante[]> {
    return this.http.get<DesempenoEstudiante[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<DesempenoEstudiante> {
    return this.http.get<DesempenoEstudiante>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(desempeno: DesempenoEstudiante): Observable<DesempenoEstudiante> {
    return this.http.post<DesempenoEstudiante>(this.apiUrl, desempeno, { headers: this.getHeaders() });
  }

  update(id: number, desempeno: DesempenoEstudiante): Observable<DesempenoEstudiante> {
    return this.http.put<DesempenoEstudiante>(`${this.apiUrl}/${id}`, desempeno, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getPredicciones(): Observable<any> { // Ajusta el tipo según lo que devuelva tu backend
    return this.http.get<any>(`${this.apiUrl}/predicciones`, { headers: this.getHeaders() });
  }
}