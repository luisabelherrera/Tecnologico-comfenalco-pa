import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscripcion } from 'src/app/models/inscripcion.interface';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  private apiUrl = 'http://localhost:8086/api/inscripciones';

  constructor(private http: HttpClient) { }

  getAllInscripciones(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(this.apiUrl);
  }

  getInscripcionById(id: number): Observable<Inscripcion> {
    return this.http.get<Inscripcion>(`${this.apiUrl}/${id}`);
  }

  createInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(this.apiUrl, inscripcion);
  }

  updateInscripcion(id: number, inscripcion: Inscripcion): Observable<Inscripcion> {
    return this.http.put<Inscripcion>(`${this.apiUrl}/${id}`, inscripcion);
  }

  deleteInscripcion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
