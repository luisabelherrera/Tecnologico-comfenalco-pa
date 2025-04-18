import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// Interface matching the InformacionInstitucional entity from Java
export interface InformacionInstitucional {
  id?: string;
  nombreInstitucion: string;
  mision: string;
  vision: string;
  historia: string;
  valores: string;
  objetivos: string;
  contacto: string;
  manualConvivenciaPath: string;
  reglamentoInternoPath: string;
  logoPath: string;
  nivelesEducativos: string;
  enfasisInstitucional: string;
  preparacionIcfes: string;
  programasEspeciales: string;
  convenios: string;
  actividadesExtracurriculares: string;
  pastoralOCatequesis: string;
  planDeEstudiosPath: string;
  calendarioAcademicoPath: string;
}

@Injectable({
  providedIn: 'root'
})
export class InformacionInstitucionalService {
  private apiUrl = `${environment.apiUrl}api/institucion`; // Usará http://localhost:8080/api/institucion si environment está bien configurado

  constructor(private http: HttpClient) {}

  // Método para obtener encabezados de autenticación (privado para uso administrativo)
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('No se encontró token en localStorage. Las solicitudes podrían fallar.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  // Handle errors in a centralized way
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.status === 0) {
      errorMessage = 'No se pudo conectar al servidor. Verifica que esté corriendo en ' + this.apiUrl;
    } else if (error.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
    } else if (error.status === 403) {
      errorMessage = 'Acceso denegado. No tienes permisos para esta acción.';
    } else if (error.status === 404) {
      errorMessage = 'Información no encontrada.';
    } else if (error.status === 400) {
      errorMessage = error.error || 'Solicitud inválida. Verifica los datos enviados.';
    } else {
      errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  // GET para uso público (sin token)
  getPublic(): Observable<InformacionInstitucional> {
    return this.http.get<InformacionInstitucional>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // GET para uso administrativo (con token)
  get(): Observable<InformacionInstitucional> {
    return this.http.get<InformacionInstitucional>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // POST (create) - solo para administradores (con token)
  create(info: InformacionInstitucional): Observable<InformacionInstitucional> {
    return this.http.post<InformacionInstitucional>(this.apiUrl, info, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // PUT (update) - solo para administradores (con token)
  update(info: InformacionInstitucional): Observable<InformacionInstitucional> {
    return this.http.put<InformacionInstitucional>(this.apiUrl, info, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}