
import { Curso } from "./curso.model";
import { NivelDetalle } from "./NivelDetalle.interface";


export interface NivelDetalleCurso {
    idNivelDetalleCurso: number;
    nivelDetalle: NivelDetalle;
    curso: Curso;
    activo: boolean;
    fechaRegistro: Date;
}
