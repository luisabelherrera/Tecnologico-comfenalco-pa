import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/AuthService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Institucion Educativa El Hobo';
  userEmail$ = this.authService.userEmail$;

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

  ia = [
    { path: '/ia', icon: 'account_circle', title: 'IA GEMINIS' }
  ];
  chat = [{ path: '/chat', icon: 'chat', title: 'Chat' }];
  exit = [{ path: '/login', icon: 'exit_to_app', title: 'Cerrar Sesión' }];

  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  logout() {
    this.authService.logout();
  }
}
