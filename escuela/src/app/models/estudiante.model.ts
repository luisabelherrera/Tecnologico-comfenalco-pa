export interface Estudiante {
    id: number;
    nombre: string;
    apellido: string;
    fechaNacimiento: string; 
    grado: string;
    direccion: string;
    telefono: string;
    email: string;
    documento: string;
    genero: string;
    estado: string;
    tutor: {
      id: number;
      nombre: string;
      apellido: string;
      telefono: string;
      email: string;
    };
 
  }
  