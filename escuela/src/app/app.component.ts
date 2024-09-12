import { Component } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { AuthService } from './services/auth/AuthService.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Institucion Educativa El Hobo';

  links = [{ path: '/home', icon: 'home', title: 'Inicio' }];

  Matricula = [
    { path: '/tutor', icon: 'person', title: 'Tutores' },
    { path: '/aulas', icon: 'school', title: 'Aulas' },
    { path: '/asignaciones-aulas', icon: 'assignment', title: 'Asignar Aulas' },
    { path: '/profesores', icon: 'school', title: 'Profesores' },
    { path: '/departamentos', icon: 'business', title: 'Departamentos' },
    { path: '/cursos', icon: 'book', title: 'Cursos' },
    { path: '/estudiantes', icon: 'people', title: 'Estudiantes' },
    { path: '/inscripciones', icon: 'event_note', title: 'Inscripciones' },
  ];

  chat = [{ path: '/chat', icon: 'chat', title: 'Chat' }];

 exit = [{ path: '', icon: 'exit_to_app', title: 'Cerrar Sesión' }];

  isAuthenticated$ = this.authService.isAuthenticated$.pipe(shareReplay(1));

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
