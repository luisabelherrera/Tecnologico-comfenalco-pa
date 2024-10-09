import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface AuthResponse {
  statusCode: number;
  message: string;
  token: string;
  refreshToken?: string;
  expirationTime?: string;
  ourUsers?: {
    id: number;
    email: string;
    role: string;
    enabled: boolean;
    authorities: Array<{ authority: string }>;
    username: string;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    accountNonExpired: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  signUp(data: SignUpData): Observable<AuthResponse> {
    console.log('Iniciando registro con datos:', data);
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, data)
      .pipe(catchError(this.handleError));
  }

  signIn(data: SignInData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, data)
      .pipe(catchError(this.handleError));
  }
  
  refreshToken(data: any): Observable<AuthResponse> {
    console.log('Renovando token con datos:', data);
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, data)
      .pipe(catchError(this.handleError));
  }

  handleSignInResponse(response: AuthResponse) {
    console.log('Manejando respuesta de inicio de sesión:', response);
    localStorage.setItem('token', response.token);
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    // Manejo opcional del tiempo de expiración
    if (response.expirationTime) {
      localStorage.setItem('expirationTime', response.expirationTime);
    }
  }

  logout() {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expirationTime');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    console.log('Usuario está logueado:', !!token);
    return !!token;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
