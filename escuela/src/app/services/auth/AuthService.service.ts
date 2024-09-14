import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtResponseDto, LoginDto } from 'src/app/models/models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8086/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private userEmailSubject = new BehaviorSubject<string | null>(null);
  userEmail$ = this.userEmailSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthenticationStatus();
  }

  login(loginDto: LoginDto): Observable<JwtResponseDto> {
    return this.http.post<JwtResponseDto>(`${this.apiUrl}/login`, loginDto).pipe(
      map(response => {
        localStorage.setItem('accessToken', response.accessToken);
        this.isAuthenticatedSubject.next(true);
        // Aquí se puede obtener el email del usuario de la respuesta si es proporcionado
        const userEmail = loginDto.email; // Usar el email del loginDto, o extraerlo de la respuesta si es posible
        this.userEmailSubject.next(userEmail);
        return response;
      }),
      catchError(error => {
        this.isAuthenticatedSubject.next(false);
        return throwError(error);
      })
    );
  }


  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.isAuthenticatedSubject.next(false);
    this.userEmailSubject.next(null); // Limpiar el email del usuario
    this.router.navigate(['/login']);
  }

  private checkAuthenticationStatus() {
    const token = localStorage.getItem('accessToken');
    this.isAuthenticatedSubject.next(!!token);
    if (token) {
      // Si hay un token, se podría obtener el email del usuario aquí si se dispone de esa información
      // Por ahora se mantiene el email desde el login
      this.userEmailSubject.next(null); // Cambiar esto a obtener email si se tiene
    }
  }
}
