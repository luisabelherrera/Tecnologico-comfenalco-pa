import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NivelDetalleCurso } from 'src/app/models/entity/NivelDetalleCurso.interface';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';


export interface Asistencia {
  idAsistencia?: number;
  activo?: boolean;
  fecha: Date | string;
  asistio: boolean;
  estudiante: Estudiante;
  nivelDetalleCurso: NivelDetalleCurso;
  fechaRegistro?: Date | string;
}

export interface EstudianteAsistencia {
  estudiante: Estudiante;
  asistencia?: Asistencia;
  asistio?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = `${environment.apiUrl}api/asistencia`; // Ajusta según tu endpoint en Spring Boot

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAsistenciasPorCurso(idNivelDetalleCurso: number): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.apiUrl}/curso/${idNivelDetalleCurso}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  registrarAsistencia(asistencia: Asistencia): Observable<Asistencia> {
    return this.http.post<Asistencia>(`${this.apiUrl}/registrar`, asistencia, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  actualizarAsistencia(asistencia: Asistencia): Observable<Asistencia> {
    return this.http.put<Asistencia>(`${this.apiUrl}/${asistencia.idAsistencia}`, asistencia, { headers: this.getHeaders() })
    .pipe(catchError(this.handleError));
  }
  private handleError(error: any) {
    console.error('Error en la petición de asistencia:', error);
    return throwError(() => new Error('Hubo un problema al gestionar la asistencia.'));
  }
}