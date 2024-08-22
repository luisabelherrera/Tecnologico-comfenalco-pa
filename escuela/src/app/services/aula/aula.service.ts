import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Aula } from 'src/app/models/aula';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AulaService {
  private apiUrl = 'http://localhost:8086/api/aulas';

  constructor(private http: HttpClient) { }

  getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(this.apiUrl);
  }

  getAulaById(id: number): Observable<Aula> {
    return this.http.get<Aula>(`${this.apiUrl}/${id}`);
  }

  createAula(aula: Aula): Observable<Aula> {
    return this.http.post<Aula>(this.apiUrl, aula);
  }

  updateAula(aula: Aula): Observable<Aula> {
    return this.http.put<Aula>(`${this.apiUrl}/${aula.id}`, aula);
  }

  deleteAula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
