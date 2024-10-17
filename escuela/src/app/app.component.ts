import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth/AuthService.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = ' Institucion Educativa El Hobo';
  userEmail$ = this.authService.userEmail$;


  isMatriculaMenuOpen = false; 
  isConfigMenuOpen = false;
  isChatMenuOpen = false; 
  isUserMenuOpen = false; 
  isConfiguracionesMenuOpen = false; 
  isExitMenuOpen = false; 
  isAlumnoMenuOpen = false;
  isDocenteMenuOpen = false; 
  isCursoMenuOpen = false; 
  isAdministrarUsuarioMenuOpen = false; 
  islinksMenuOpen = false;
  isVentana3MenuOpen = false;

 
  links = [{ path: '/home', icon: 'home', title: 'Inicio' }];

  ia = [{ path: '/ia', icon: 'home', title: 'ia' }];


  Alumno = [
    { path: '/listar', icon: 'list', title: 'Estudiante' },
    { path: '/acudientes', icon: 'family_restroom', title: 'Acudiente' },
  ];

  Docente = [
    { path: '/docentes', icon: 'person', title: 'Docentes' },
    { path: '/curriculares', icon: 'assignment', title: 'Curriculares' },
    { path: '/calificaciones', icon: 'grade', title: 'Calificaciones' },
  ];

  Curso = [
    { path: '/cursos', icon: 'school', title: 'Cursos' },
    { path: '/niveldetallecurso', icon: 'school', title: 'Nivel Detalle Curso' },
  ];

  Matricula = [
    { path: '/matricula', icon: 'assignment_ind', title: 'Matrícula' },
  ];

  configuraciones = [
    { path: '/periodo', icon: 'calendar_today', title: 'Crear Periodo' },
    { path: '/nivel', icon: 'school', title: 'Crear Nivel Académico' },
    { path: '/grado-seccion', icon: 'class', title: 'Crear Grado y Sección' },
    { path: '/niveldetalle', icon: 'list', title: 'Nivel Detalle' },
    { path: '/horario', icon: 'schedule', title: 'Horario' },
    { path: '/docentes/detalle', icon: 'assignment_ind', title: 'Docentes y Cursos' },
  ];

  AdministrarUsuario = [
    { path: '/registro', icon: 'person_add', title: 'Registrar' },
  ];

  userLinks = [
    { path: '/ventana2', icon: 'book', title: 'calificaciones' },
    { path: '/curricularDocente', icon: 'book', title: 'curricular' },
    { path: '/horarioDocente', icon: 'book', title: 'horario' },
  ];

  Ventana3Links = [ 
    { path: '/ventana3', icon: 'book', title: 'Calificación' },
    { path: '/curricularEstudiante', icon: 'book', title: 'contenido curricular' },
    { path: '/horarioEstudiante', icon: 'book', title: 'Mi horario' },
  ];

  isAuthenticated$ = this.authService.isAuthenticated$;
  isAdmin$ = this.authService.isAdmin$;
  isManager$ = this.authService.isManager$;
  currentLinks = [];
  private unsubscribe$ = new Subject<void>();
  userName$ = this.authService.userName$;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAdmin$.pipe(takeUntil(this.unsubscribe$)).subscribe((isAdmin) => {
      if (isAdmin) {
        this.currentLinks = [
          ...this.Alumno, 
          ...this.configuraciones, 
          ...this.AdministrarUsuario, 
          ...this.Matricula, 
          ...this.Docente, 
          ...this.Curso
        ];
      } else {
        this.isManager$.pipe(takeUntil(this.unsubscribe$)).subscribe((isManager) => {
          if (isManager) {
      
            this.currentLinks = [...this.Ventana3Links];
          } else {
            
            this.currentLinks = [...this.userLinks];
          }
        });
      }
    });
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.authService.logout();
  }
}
