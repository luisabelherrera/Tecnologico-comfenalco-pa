import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/AuthService.service';
import { UserDto } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class EstudiantePerfilService {
  private apiUrl = `${environment.apiUrl}estudiantee`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getStudentProfile(): Observable<UserDto> {
    const headers = this.getHeaders();
    return this.http.get<UserDto>(this.apiUrl, { headers });
  }

}
