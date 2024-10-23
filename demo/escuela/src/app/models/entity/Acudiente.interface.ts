export interface Acudiente {
  idAcudiente?: number;  
  nombres: string;
  apellidos: string;
  documentoIdentidad: string;
  ciudad: string;
  direccion: string;
  estadoCivil: string;
  sexo: string;
  fechaNacimiento?: Date;  
  activo: boolean;
  parentesco?: string;  
}
