export interface Estudiante {
    id: number;
    nombre: string;
    apellido: string;
    fechaNacimiento: string; 
    grado: string;
    direccion: string;
    telefono: string;
    email: string;
    genero: string;
    documento: string;
    estado: string;
    tutor: {
      id: number;
      nombre: string;
      apellido: string;
      telefono: string;
      email: string;
    };
    imagen?: string; 
  }
  