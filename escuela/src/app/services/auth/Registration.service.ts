import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RegisterDto, RoleDto, UserDto } from 'src/app/models/models';
import { Router } from '@angular/router';
import { Docente } from 'src/app/models/entity/docente.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:8086/api';

  constructor(private http: HttpClient, private router: Router) {}

  private handleError(error: any): Observable<never> {
    const errorMessage = error.error instanceof ErrorEvent
      ? `Client Error: ${error.error.message}`
      : `Server Error Code: ${error.status}\nMessage: ${error.error.message}`;
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    } else {
      this.router.navigate(['/login']);
      return headers;
    }
  }

  getAllDocentes(): Observable<Docente[]> {
    return this.http.get<Docente[]>(`${this.apiUrl}/docentes`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  register(registerDto: RegisterDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/register`, registerDto, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/register/users`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/register/users/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  
  createRole(roleDto: RoleDto): Observable<RoleDto> {
    return this.http.post<RoleDto>(`${this.apiUrl}/register/roles`, roleDto, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllRoles(): Observable<RoleDto[]> {
    return this.http.get<RoleDto[]>(`${this.apiUrl}/register/roles`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}
