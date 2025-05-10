import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDto } from 'src/app/models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocentePerfilService {
  private apiUrl = `${environment.apiUrl}api/docentee`; // Adjust based on backend endpoint

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPerfilDocente(): Observable<UserDto> {
    return this.http.get<UserDto>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }


  

  private handleError(error: any) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Hubo un problema al obtener el perfil del docente.'));
  }
}