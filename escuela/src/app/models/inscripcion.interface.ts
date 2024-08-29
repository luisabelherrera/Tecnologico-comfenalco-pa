export interface Inscripcion {
  id: number;
  estudiante: {
    id: number;
    nombre: string;
    apellido: string;
  };
  curso: {
    id: number;
    nombre: string;
  };
  fechaInscripcion: string;
  calificacion: number;
}
