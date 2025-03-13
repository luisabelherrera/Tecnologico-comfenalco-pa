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
  email?: string;  

  telefono: string;
  activo: boolean;
  parentesco?: string;  
  
}
