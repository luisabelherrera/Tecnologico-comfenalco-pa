export interface JwtResponseDto {
    accessToken: string;
  }
  
  export interface LoginDto {
    email: string;
    password: string;
  }
  export interface RoleDto {
    id: number;
    name: string;
  }
  
  
  export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    roles: RoleDto[]; // Asegúrate de que el tipo sea correcto
  }
  export interface UserDto {
    username: string;
    password: string;
    email: string;
    roles: string[];
  }
  