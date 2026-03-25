export interface Docente {
    idDocente: number;
    valorCodigo: number;
    codigo: string;
    documentoIdentidad: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: Date;
    sexo: string;
    gradoEstudio: string;
    ciudad: string;
    direccion: string;
    email: string;
    numeroTelefono: string;
    activo: boolean;
    fechaRegistro: Date;
}
