import { SafeResourceUrl } from '@angular/platform-browser';

export interface Comentario {
    autor: string;
    contenido: string;
    fechaCreacion?: Date;
}

export interface Noticia {
    id?: string;
    titulo: string;
    contenido: string;
    imagen?: SafeResourceUrl | string; // Can be a URL or binary data
    tipoImagen?: string;
    fechaCreacion?: Date | string; // Accepts string from MongoDB
    likesCount?: number; // Matches MongoDB field
    likedBy?: string[];
    comentarios?: Comentario[];
}