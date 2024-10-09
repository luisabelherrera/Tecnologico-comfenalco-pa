// src/app/services/grado-seccion/grado-seccion.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GradoSeccion } from 'src/app/models/entity/GradoSeccion.interface';


@Injectable({
  providedIn: 'root'
})
export class GradoSeccionService {
  private apiUrl = 'http://localhost:8086/api/grado-seccion'; // Ruta a la API

  constructor(private http: HttpClient) {}

  // Método para obtener los encabezados con el token de acceso
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todos los GradoSeccion
  getAllGradoSecciones(): Observable<GradoSeccion[]> {
    return this.http.get<GradoSeccion[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Obtener un GradoSeccion por ID
  getGradoSeccionById(id: number): Observable<GradoSeccion> {
    return this.http.get<GradoSeccion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Crear un nuevo GradoSeccion
  createGradoSeccion(gradoSeccion: GradoSeccion): Observable<GradoSeccion> {
    return this.http.post<GradoSeccion>(this.apiUrl, gradoSeccion, { headers: this.getHeaders() });
  }

  // Actualizar un GradoSeccion existente
  updateGradoSeccion(id: number, gradoSeccion: GradoSeccion): Observable<GradoSeccion> {
    return this.http.put<GradoSeccion>(`${this.apiUrl}/${id}`, gradoSeccion, { headers: this.getHeaders() });
  }

  // Eliminar un GradoSeccion
  deleteGradoSeccion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
