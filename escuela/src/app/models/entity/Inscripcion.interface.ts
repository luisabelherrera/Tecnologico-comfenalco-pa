import { Acudiente } from "./Acudiente.interface";
import { Estudiante } from "./Estudiante.interface";
import { NivelDetalle } from "./NivelDetalle.interface";

export interface Inscripcion { // Cambia el nombre aquí
  idInscripcion?: number;                  // Unique identifier for the inscripcion
  valorCodigo?: number;                    // Value code associated with the inscripcion
  codigo?: string;                         // Enrollment code
  situacion?: string;                     // Situation of the enrollment (optional)
  nivelDetalle?: NivelDetalle;             // Current status of the enrollment
  estudiante?: Estudiante;                 // Associated student information
  acudiente?: Acudiente;                   // Associated guardian information
  institucionProcedencia?: string;       // Previous institution (optional)
  esRepitente?: boolean;                   // Indicates if the student is repeating
  activo?: boolean;                        // Indicates if the inscripcion is active
  fechaRegistro?: Date;                    // Date of registration
}
