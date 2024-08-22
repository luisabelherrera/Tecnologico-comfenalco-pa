import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsignacionAula } from 'src/app/models/AsignacionAula.interface';

@Injectable({
  providedIn: 'root'
})
export class AsignacionAulaService {
  private apiUrl = 'http://localhost:8086/api/asignaciones-aulas';

  constructor(private http: HttpClient) {}

  getAllAsignacionesAulas(): Observable<AsignacionAula[]> {
    return this.http.get<AsignacionAula[]>(this.apiUrl);
  }

  getAsignacionAulaById(id: number): Observable<AsignacionAula> {
    return this.http.get<AsignacionAula>(`${this.apiUrl}/${id}`);
  }

  createAsignacionAula(asignacionAula: AsignacionAula): Observable<AsignacionAula> {
    return this.http.post<AsignacionAula>(this.apiUrl, asignacionAula);
  }

  updateAsignacionAula(id: number, asignacionAula: AsignacionAula): Observable<AsignacionAula> {
    return this.http.put<AsignacionAula>(`${this.apiUrl}/${id}`, asignacionAula);
  }

  deleteAsignacionAula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
