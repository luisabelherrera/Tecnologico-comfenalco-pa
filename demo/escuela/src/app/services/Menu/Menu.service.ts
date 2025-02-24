import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Noticia } from 'src/app/models/entity/Noticia.interface';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {

  private apiUrl = `${environment.apiUrl}api/noticias`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Método para crear una noticia
  crearNoticia(titulo: string, contenido: string, imagen: File): Observable<Noticia> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido', contenido);
    formData.append('imagen', imagen);

    return this.http.post<Noticia>(`${this.apiUrl}/crear`, formData, { headers: this.getHeaders() });
  }

  // Método para obtener todas las noticias
  obtenerNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Método para obtener la imagen de una noticia
  obtenerImagenNoticia(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/imagen/${id}`, { headers: this.getHeaders(), responseType: 'blob' });
  }

  // Método para actualizar una noticia
  actualizarNoticia(id: string, titulo: string, contenido: string, imagen?: File): Observable<Noticia> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido', contenido);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    return this.http.put<Noticia>(`${this.apiUrl}/actualizar/${id}`, formData, { headers: this.getHeaders() });
  }

// Método para agregar un comentario a una noticia
agregarComentario(id: string, comentario: { autor: string, contenido: string }): Observable<Noticia> {
  return this.http.post<Noticia>(`${this.apiUrl}/${id}/comentarios`, comentario, { headers: this.getHeaders() });
}

darLike(id: string): Observable<Noticia> {
  return this.http.post<Noticia>(`${this.apiUrl}/${id}/likes`, {}, { headers: this.getHeaders() });
}
actualizarLikes(noticiaId: string, likedBy: string[]): Observable<Noticia> {
  return this.http.put<Noticia>(`${this.apiUrl}/${noticiaId}/likes`, { likedBy }, { headers: this.getHeaders() });
}
  // Método para eliminar una noticia
  eliminarNoticia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, { headers: this.getHeaders() });
  }
}
