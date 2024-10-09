export interface Estudiante {
    id?: number; // Campo opcional para el ID
    valorCodigo: string; // Código del estudiante
    codigo: string; // Código único del estudiante
    nombres: string; // Nombres del estudiante
    apellidos: string; // Apellidos del estudiante
    documentoIdentidad: string; // Documento de identidad
    fechaNacimiento: Date; // Fecha de nacimiento
    sexo: string; // Sexo del estudiante
    ciudad: string; // Ciudad de residencia
    direccion: string; // Dirección del estudiante
    activo: boolean; // Estado activo del estudiante
  }
  