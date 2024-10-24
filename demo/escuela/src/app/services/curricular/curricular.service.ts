import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurricularService {
    private apiUrl = `${environment.apiUrl}api/curriculares`;


  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCurriculares(): Observable<Curricular[]> {
    return this.http.get<Curricular[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getCurricularById(id: number): Observable<Curricular> {
    return this.http.get<Curricular>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createCurricular(curricular: Curricular): Observable<Curricular> {
    return this.http.post<Curricular>(this.apiUrl, curricular, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateCurricular(id: number, curricular: Curricular): Observable<Curricular> {
    return this.http.put<Curricular>(`${this.apiUrl}/${id}`, curricular, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteCurricular(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Error occurred:', error);
    return throwError(() => new Error('Error en la operación. Inténtalo de nuevo más tarde.'));
  }
}
