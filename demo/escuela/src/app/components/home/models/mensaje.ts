export class Mensaje {
  id?: string;
  texto: string = '';
  fecha?: Date | number; // Allow both types
  username?: string;
  tipo?: string;
  color?: string;
}