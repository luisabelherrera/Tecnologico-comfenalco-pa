import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtResponseDto, LoginDto, RegisterDto, RoleDto } from 'src/app/models/models';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}api`;


  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  private userEmailSubject = new BehaviorSubject<string | null>(null);
  userEmail$ = this.userEmailSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  private isManagerSubject = new BehaviorSubject<boolean>(false);
  isManager$ = this.isManagerSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthenticationStatus();
  }


  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerDto).pipe(
      catchError((error) => {
        console.error('Error al registrar:', error);
        return throwError('El registro falló. Por favor, inténtalo de nuevo.');
      })
    );
  }

  getAllRoles(): Observable<RoleDto[]> {
    return this.http.get<RoleDto[]>(`${this.apiUrl}/roles`).pipe(
      catchError((error) => {
        console.error('Error al obtener roles:', error);
        return throwError('No se pudieron obtener los roles. Por favor, inténtalo de nuevo.');
      })
    );
  }

  login(loginDto: LoginDto): Observable<JwtResponseDto> {
    return this.http.post<JwtResponseDto>(`${this.apiUrl}/login`, loginDto).pipe(
      map((response) => {
        this.handleLoginSuccess(response);
        return response;
      }),
      catchError((error) => {
        console.error('Error al iniciar sesión:', error);
        this.isAuthenticatedSubject.next(false);
        return throwError('Error en el inicio de sesión. Verifica tus credenciales e inténtalo de nuevo.');
      })
    );
  }
  
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('email');
    this.isAuthenticatedSubject.next(false);
    this.userNameSubject.next(null);
    this.userEmailSubject.next(null);
    this.isAdminSubject.next(false);
    this.isManagerSubject.next(false);
    this.router.navigate(['/login']);
  }


  private handleLoginSuccess(response: JwtResponseDto) {
    const token = response.accessToken;
    localStorage.setItem('accessToken', token);
    
    localStorage.setItem('username', response.username); 
    
    localStorage.setItem('roles', JSON.stringify(response.roles)); 
    localStorage.setItem('email', response.email); 
    

    this.isAuthenticatedSubject.next(true);
    this.userNameSubject.next(response.username); 
    this.userEmailSubject.next(response.email);
    
    this.updateAdminStatus(response.roles);
    this.updateManagerStatus(response.roles);
    
    this.redirectUser(response.roles); 
  }

  private checkAuthenticationStatus() {
    const token = localStorage.getItem('accessToken');
    this.isAuthenticatedSubject.next(!!token);
    if (token) {
      this.userNameSubject.next(localStorage.getItem('username'));
      this.userEmailSubject.next(localStorage.getItem('email'));
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      this.updateAdminStatus(roles);
      this.updateManagerStatus(roles);
    }
  }

  private updateAdminStatus(roles: string[] = []) {
    const isAdmin = roles.includes('Administracion');
    this.isAdminSubject.next(isAdmin);
  }

  private updateManagerStatus(roles: string[] = []) {
    const isManager = roles.includes('Estudiante');
    this.isManagerSubject.next(isManager);
  }

  private redirectUser(roles: string[]) {
    if (roles.includes('Administracion')) {
      this.router.navigate(['/home']);
    } else if (roles.includes('Estudiante')) {
      this.router.navigate(['/ventana3']); 
    } else if (roles.includes('Docente')) {
      this.router.navigate(['/ventana2']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getUserRole(): string[] {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    return roles;
  }
}
