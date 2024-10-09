// src/app/models/menu.model.ts

export interface Menu {
    idMenu: number;
    nombre: string;
    icono: string;
    activo: boolean;
    fechaRegistro?: string; // Esta propiedad puede ser opcional
}
