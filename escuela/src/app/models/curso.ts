
export interface Curso {
    id: number;
    nombre: string;
    descripcion: string;
    horario: string;
    profesor: {
      id: number;
      nombre: string;
    };
    aula: {
      id: number;
      nombre: string;
    };
  }
  