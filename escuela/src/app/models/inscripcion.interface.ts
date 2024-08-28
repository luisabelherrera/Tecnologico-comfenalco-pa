export interface Inscripcion {
  
    id: number;
    estudiante: {
      id: number;
    };
    curso: {
      id: number;
      
    };
    fechaInscripcion: string; 
    calificacion: number;
  }
  