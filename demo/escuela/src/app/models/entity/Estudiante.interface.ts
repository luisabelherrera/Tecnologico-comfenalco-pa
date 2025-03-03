export interface Estudiante {
  idEstudiante: number;
  valorCodigo: string; // Changed to string
  codigo: string;
  nombres: string;
  apellidos: string;
  documentoIdentidad: string;
  fechaNacimiento: Date; // Changed to Date
  sexo: string;
  ciudad: string;
  direccion: string;
  activo: boolean;
}