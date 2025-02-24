import { Docente } from "./entity/docente.model";
import { Estudiante } from "./entity/Estudiante.interface";


export interface JwtResponseDto {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  username: string;
  email: string;
  roles: string[]; 
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  id: number;
  username: string;
  email: string;
  password: string;
  roles: RoleDto[];  
  docenteInfo: Docente; 
  estudianteId: number;
}
export interface RoleDto {
  id: number;
  name: string;
}
export interface UserDto {
  id: number;
  username: string;
  email: string;
  roles: RoleDto[];
  password: string;
  estudiante: Estudiante;
  docenteInfo: Docente;
}