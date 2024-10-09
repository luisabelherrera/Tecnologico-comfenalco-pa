
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GradoSeccion } from 'src/app/models/entity/GradoSeccion.interface';


@Injectable({
  providedIn: 'root'
})
export class GradoSeccionService {
  private apiUrl = 'http://localhost:8086/api/grado-seccion'; 

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getAllGradoSecciones(): Observable<GradoSeccion[]> {
    return this.http.get<GradoSeccion[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  getGradoSeccionById(id: number): Observable<GradoSeccion> {
    return this.http.get<GradoSeccion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createGradoSeccion(gradoSeccion: GradoSeccion): Observable<GradoSeccion> {
    return this.http.post<GradoSeccion>(this.apiUrl, gradoSeccion, { headers: this.getHeaders() });
  }
  updateGradoSeccion(id: number, gradoSeccion: GradoSeccion): Observable<GradoSeccion> {
    return this.http.put<GradoSeccion>(`${this.apiUrl}/${id}`, gradoSeccion, { headers: this.getHeaders() });
  }

  deleteGradoSeccion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
