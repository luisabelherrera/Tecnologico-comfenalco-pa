import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface PrecioNivelEducativo {
  id?: string;
  nivel: string;
  concepto: string;
  monto: number;
  imagenPath?: string;
  descripcion?: string;
  periodicidad?: string;
  fechaInicio?: string; // Use string for Date since JSON uses ISO strings
  fechaFin?: string;
  descuento?: number;
  categoria?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PreciosEducativosService {
  private apiUrl = `${environment.apiUrl}api/precios`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Método protegido para administradores (con token)
  getAll(): Observable<PrecioNivelEducativo[]> {
    return this.http.get<PrecioNivelEducativo[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Método público para todos los usuarios (sin token)
  getAllPublic(): Observable<PrecioNivelEducativo[]> {
    return this.http.get<PrecioNivelEducativo[]>(`${this.apiUrl}/public`)
      .pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<PrecioNivelEducativo> {
    return this.http.get<PrecioNivelEducativo>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  create(precio: PrecioNivelEducativo, image?: File): Observable<PrecioNivelEducativo> {
    const formData = new FormData();
    formData.append('nivel', precio.nivel);
    formData.append('concepto', precio.concepto);
    formData.append('monto', precio.monto.toString());
    if (precio.descripcion) formData.append('descripcion', precio.descripcion);
    if (precio.periodicidad) formData.append('periodicidad', precio.periodicidad);
    if (precio.fechaInicio) formData.append('fechaInicio', precio.fechaInicio);
    if (precio.fechaFin) formData.append('fechaFin', precio.fechaFin);
    if (precio.descuento !== undefined && precio.descuento !== null) {
      formData.append('descuento', precio.descuento.toString());
    }
    if (precio.categoria) formData.append('categoria', precio.categoria);
    if (image) formData.append('imagen', image);

    return this.http.post<PrecioNivelEducativo>(`${this.apiUrl}/crear`, formData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  update(id: string, precio: PrecioNivelEducativo, image?: File): Observable<PrecioNivelEducativo> {
    const formData = new FormData();
    formData.append('nivel', precio.nivel);
    formData.append('concepto', precio.concepto);
    formData.append('monto', precio.monto.toString());
    if (precio.descripcion) formData.append('descripcion', precio.descripcion);
    if (precio.periodicidad) formData.append('periodicidad', precio.periodicidad);
    if (precio.fechaInicio) formData.append('fechaInicio', precio.fechaInicio);
    if (precio.fechaFin) formData.append('fechaFin', precio.fechaFin);
    if (precio.descuento !== undefined && precio.descuento !== null) {
      formData.append('descuento', precio.descuento.toString());
    }
    if (precio.categoria) formData.append('categoria', precio.categoria);
    if (image) formData.append('imagen', image);

    return this.http.put<PrecioNivelEducativo>(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Método para obtener imágenes públicamente (sin token)
  getImagePublic(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/imagen/public/${id}`, { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error de cliente o red:', error.error.message);
    } else {
      console.error(`Error del servidor: código ${error.status}, cuerpo: ${error.error}`);
    }
    return throwError('Ocurrió un error, intenta de nuevo más tarde.');
  }
}