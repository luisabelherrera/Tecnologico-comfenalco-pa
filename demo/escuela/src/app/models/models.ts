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
  estudiante: Estudiante;
}
export interface RoleDto {
  id: number;
  name: string;
}
export interface UserDto {
  id: number;
  username: string;
  password: string;
  email: string;
  roles: RoleDto[];  
  docenteInfo: Docente; 
  estudiante: Estudiante;
}