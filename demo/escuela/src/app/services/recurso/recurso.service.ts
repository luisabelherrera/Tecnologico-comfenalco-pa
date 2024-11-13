// archivo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseFile, ResponseMessage } from 'src/app/models/entity/FileModel';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}api/fileManager`;

  constructor(private http: HttpClient) {}

  // Método para obtener encabezados de autenticación
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken'); // Obtén el token del almacenamiento local
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Establece el encabezado de autorización
    });
  }

  // Subir archivo
  uploadFile(file: File): Observable<ResponseMessage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ResponseMessage>(`${this.apiUrl}/upload`, formData, { headers: this.getHeaders() });
  }

  downloadFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob', headers: this.getHeaders() });
}

  // Obtener lista de archivos
  getFiles(): Observable<ResponseFile[]> {
    return this.http.get<ResponseFile[]>(`${this.apiUrl}/files`, { headers: this.getHeaders() });
  }
}
