import { Acudiente } from "./Acudiente.interface";
import { Estudiante } from "./Estudiante.interface";
import { NivelDetalle } from "./NivelDetalle.interface";

export enum EstadoPago {
  PENDIENTE = "PENDIENTE",
  PAGADO = "PAGADO",
  EN_PROCESO = "EN_PROCESO"
}

export interface Inscripcion {
  idInscripcion?: number;
  valorCodigo: number;
  codigo: string;
  situacion: string;
  nivelDetalle: NivelDetalle;
  estudiante: Estudiante;
  acudiente: Acudiente;
  institucionProcedencia: string;
  esRepitente: boolean;
  activo: boolean;
  fechaRegistro: Date;

  // Datos de pago
  montoPago: number;
  fechaPago?: Date;
  metodoPago: string; // Ejemplo: "Efectivo", "Tarjeta", "Transferencia"
  estadoPago: EstadoPago; // Enum con valores "PENDIENTE", "PAGADO", "EN_PROCESO"
}
