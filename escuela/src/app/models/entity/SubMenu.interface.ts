import { Menu } from "./Menu.interface";

export interface SubMenu {
    idSubMenu: number;
    menu: Menu; // Relación con Menu
    nombre: string;
    nombreFormulario: string;
    accion: string;
    activo: boolean;
    fechaRegistro: string; 
}
