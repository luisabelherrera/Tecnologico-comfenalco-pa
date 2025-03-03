import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Docente } from 'src/app/models/entity/docente.model';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { RegisterDto, UserDto, RoleDto } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = `${environment.apiUrl}api`;

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    const errorMessage = error.error instanceof ErrorEvent
      ? `Client Error: ${error.error.message}`
      : `Server Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  register(registerDto: RegisterDto): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/register`,
      registerDto,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  updateUser(userId: number, updateDto: RegisterDto): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(
      `${this.apiUrl}/register/users/${userId}`,
      updateDto,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/register/users`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteUser(userId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/register/users/${userId}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getAllRoles(): Observable<RoleDto[]> {
    return this.http.get<RoleDto[]>(`${this.apiUrl}/register/roles`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/estudiantes`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllDocentes(): Observable<Docente[]> {
    return this.http.get<Docente[]>(`${this.apiUrl}/docentes`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}