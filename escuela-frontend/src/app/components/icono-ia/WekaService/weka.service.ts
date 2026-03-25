import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WekaService {
  private apiUrl = 'http://localhost:9098/api/ia/predict';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  predictIntention(texto: string): Observable<{ intencion: string }> {
    return this.http.post<{ intencion: string }>(
      this.apiUrl,
      { texto },
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error) => {
        console.error('❌ Error al comunicarse con Weka:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }
}
