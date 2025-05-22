import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
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

  // Método para crear una noticia con imagen y video opcional
  crearNoticia(titulo: string, contenido: string, imagen?: File, video?: File): Observable<Noticia> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido', contenido);
    if (imagen) {
      formData.append('imagen', imagen);
      console.log('Adding image to FormData:', imagen.name);
    }
    if (video) {
      formData.append('video', video);
      console.log('Adding video to FormData:', video.name, video.type, video.size);
    }
    return this.http.post<Noticia>(`${this.apiUrl}/crear`, formData, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error creating noticia:', error);
        return throwError(() => new Error('Failed to create noticia'));
      })
    );
  }

  // Método para obtener todas las noticias
  obtenerNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.apiUrl); // No headers with token here
  }

  // Método para obtener la imagen de una noticia
  obtenerImagenNoticia(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/imagen/${id}`, { headers: this.getHeaders(), responseType: 'blob' });
  }

  obtenerVideoNoticia(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/video/${id}`, { headers: this.getHeaders(), responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error fetching video:', error);
        return of(null); // Return null to handle gracefully
      })
    );
  }

  // Método para actualizar una noticia con imagen y video opcional
  actualizarNoticia(id: string, titulo: string, contenido: string, imagen?: File, video?: File): Observable<Noticia> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido', contenido);
    if (imagen) {
      formData.append('imagen', imagen);
    }
    if (video) {
      formData.append('video', video);
    }

    return this.http.put<Noticia>(`${this.apiUrl}/actualizar/${id}`, formData, { headers: this.getHeaders() });
  }

  // Método para agregar un comentario a una noticia
  agregarComentario(id: string, comentario: { autor: string, contenido: string }): Observable<Noticia> {
    return this.http.post<Noticia>(`${this.apiUrl}/${id}/comentarios`, comentario, { headers: this.getHeaders() });
  }

  // Método para dar like a una noticia
darLike(noticiaId: string): Observable<Noticia> {
  return this.http.post<Noticia>(`${this.apiUrl}/${noticiaId}/likes`, {}, { headers: this.getHeaders() });
}


  // Método para actualizar los likes de una noticia
  actualizarLikes(noticiaId: string, likedBy: string[]): Observable<Noticia> {
    return this.http.post<Noticia>(`${this.apiUrl}/${noticiaId}/likes`, { likedBy }, { headers: this.getHeaders() });
  }

  // Método para eliminar una noticia
  eliminarNoticia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`, { headers: this.getHeaders() });
  }
}