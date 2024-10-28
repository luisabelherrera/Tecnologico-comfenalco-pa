import { SafeResourceUrl } from "@angular/platform-browser";

export interface Noticia {
    id?: string;
    titulo: string;
    contenido: string;
    imagen?: SafeResourceUrl;
    tipoImagen?: string;
    fechaCreacion?: Date;
}
