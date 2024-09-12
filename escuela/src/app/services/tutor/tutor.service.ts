import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tutor } from 'src/app/models/tutor.interface';
import { AuthService } from '../auth/AuthService.service';

@Injectable({
  providedIn: 'root',
})
export class TutorService {
  private apiUrl = 'http://localhost:8086/api/tutores';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllTutores(): Observable<tutor[]> {
    return this.http.get<tutor[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getTutorById(id: number): Observable<tutor> {
    return this.http.get<tutor>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createTutor(tutor: tutor): Observable<tutor> {
    return this.http.post<tutor>(`${this.apiUrl}/create`, tutor, { headers: this.getHeaders() });
  }

  updateTutor(tutor: tutor): Observable<tutor> {
    return this.http.put<tutor>(`${this.apiUrl}/${tutor.id}`, tutor, { headers: this.getHeaders() });
  }

  deleteTutor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
