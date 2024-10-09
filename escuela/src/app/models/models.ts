import { Docente } from "./entity/docente.model";

// Interfaz para la respuesta de autenticación JWT
export interface JwtResponseDto {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  username: string;
  email: string;
  roles: string[]; // Aquí los roles incluirían roles relacionados a docente (como ROLE_DOCENTE)
}

// Interfaz para el login
export interface LoginDto {
  email: string;
  password: string;
}

// Interfaz para el registro, que ahora incluye un campo opcional para docente
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  roles: RoleDto[];  // Lista de roles
  docenteInfo: Docente;  // Información opcional del docente si se está registrando un docente
}

// Interfaz para los roles (sin cambios)
export interface RoleDto {
  id: number;
  name: string;
}

// Interfaz para los usuarios en general
export interface UserDto {
  id: number;
  username: string;
  password: string;
  email: string;
  roles: RoleDto[];  // Roles asociados con el usuario
  docenteInfo: Docente;  // Información adicional si el usuario es un docente
}
