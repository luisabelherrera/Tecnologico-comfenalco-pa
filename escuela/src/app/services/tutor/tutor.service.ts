import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tutor } from 'src/app/models/tutor.interface';
@Injectable({
  providedIn: 'root',
})
export class TutorService {
  private apiUrl = 'http://localhost:8086/api/tutores';

  constructor(private http: HttpClient) {}

  getAllTutores(): Observable<tutor[]> {
    return this.http.get<tutor[]>(this.apiUrl);
  }

  getTutorById(id: number): Observable<tutor> {
    return this.http.get<tutor>(`${this.apiUrl}/${id}`);
  }

  createTutor(tutor: tutor): Observable<tutor> {
    return this.http.post<tutor>(`${this.apiUrl}/create`, tutor);
  }

  updateTutor(tutor: tutor): Observable<tutor> {
    return this.http.put<tutor>(`${this.apiUrl}/${tutor.id}`, tutor);
  }

  deleteTutor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}