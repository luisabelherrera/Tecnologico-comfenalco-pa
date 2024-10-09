// src/app/services/horario.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horario } from 'src/app/models/entity/horario.model';


@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = 'http://localhost:8086/api/horario'; // Cambia esto según tu configuración

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getHorarioById(id: number): Observable<Horario> {
    return this.http.get<Horario>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createHorario(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(this.apiUrl, horario, { headers: this.getHeaders() });
  }

  updateHorario(id: number, horario: Horario): Observable<Horario> {
    return this.http.put<Horario>(`${this.apiUrl}/${id}`, horario, { headers: this.getHeaders() });
  }

  deleteHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
