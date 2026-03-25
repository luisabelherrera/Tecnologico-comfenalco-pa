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
    imagen?: SafeResourceUrl | string; // For image display
    imagenPath?: string;              // Path to image file
    video?: SafeResourceUrl | string; // For video display
    videoPath?: string;               // Path to video file
    fechaCreacion?: Date | string;
    likesCount?: number;
    likedBy?: string[];
    comentarios?: Comentario[];
    action?: string;
}