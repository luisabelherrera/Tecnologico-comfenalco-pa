import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/AuthService.service';
import { UserDto } from 'src/app/models/models';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';

@Injectable({
  providedIn: 'root'
})
export class EstudiantePerfilService {
  private apiUrl = `${environment.apiUrl}api/estudiantee`; // URL del backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCalificacionesByEstudiante(idEstudiante: number): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(`${this.apiUrl}/${idEstudiante}/calificaciones`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  

  getPerfilEstudiante(): Observable<UserDto> {
    return this.http.get<UserDto>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Hubo un problema al obtener el perfil del estudiante.'));
  }
}
