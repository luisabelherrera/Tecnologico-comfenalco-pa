// src/app/models/file.model.ts

export interface FileEntity {
  id: string;  // ID del archivo (UUID)
  nombre: string; // Nombre del archivo
  tipo: string; // Tipo de archivo
  datos: Blob; // Datos del archivo en formato Blob
}

export interface ResponseFile {
  name: string; // Nombre del archivo
  url: string; // URL para descargar el archivo
  type: string; // Tipo de archivo
  size: number; // Tamaño del archivo
}

export interface ResponseMessage {
  message: string; // Mensaje de respuesta
}
