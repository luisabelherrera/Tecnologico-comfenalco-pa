import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, retry } from 'rxjs/operators';

export interface Theme {
  id?: string;
  name: string;
  backgroundColor?: string;         // Optional for single-color
  backgroundColorLeft?: string;     // Optional for split-color left
  backgroundColorRight?: string;    // Optional for split-color right
  textColor: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TemaHeaderService {
  private apiUrl = 'https://just-tenderness-production.up.railway.app/api/themes';
  private currentThemeSubject: BehaviorSubject<Theme>;
  public currentTheme$: Observable<Theme>;

  constructor(private http: HttpClient) {
    const defaultTheme: Theme = {
      name: 'Default',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      isActive: true
    };
    this.currentThemeSubject = new BehaviorSubject<Theme>(defaultTheme);
    this.currentTheme$ = this.currentThemeSubject.asObservable();

    this.loadActiveTheme();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  getThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      retry(2)
    );
  }

  saveTheme(theme: Theme): Observable<Theme> {
    return this.http.post<Theme>(this.apiUrl, theme, { headers: this.getHeaders() }).pipe(
      tap(savedTheme => this.applyTheme(savedTheme))
    );
  }
  deleteTheme(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => {
        // If the deleted theme was the current theme, reset to default
        const currentTheme = this.getCurrentTheme();
        if (currentTheme.id === id) {
          this.loadActiveTheme(); // This will load the new active theme
        }
      }),
      retry(2)
    );
  }
  
  applyTheme(theme: Theme) {
    console.log('Aplicando tema en el frontend:', theme);
    this.currentThemeSubject.next(theme);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  private loadActiveTheme() {
    this.http.get<Theme>(`${this.apiUrl}/active`).pipe(
      retry(2)
    ).subscribe({
      next: (theme) => {
        console.log('Tema activo cargado:', theme);
        this.applyTheme(theme);
      },
      error: (err) => {
        console.error('Error al cargar tema activo:', err);
        this.applyTheme({
          name: 'Default',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          isActive: true
        });
      }
    });
  }
}