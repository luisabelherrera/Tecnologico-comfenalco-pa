import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from './services/auth/AuthService.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionesDialogComponent } from './components/notificaciones-dialog/notificaciones-dialog.component';
import { NotificacionService } from './services/notificacion/NotificacionService';
import { NavigationStart, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { IconoIaComponent } from './components/icono-ia/icono-ia.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Institucion Educativa El Hobo';
  userEmail$ = this.authService.userEmail$;
  @ViewChild('sidenav') sidenav!: MatSidenav; 
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
  isMenu = false;
  hasPendingNotifications: boolean = false; // Controla el estado pendiente
  isNotificationBlinking: boolean = false; // Controla el parpadeo
  

  
  links = [{ path: '/home', icon: 'assets/iconos/school.png', title: 'Inicio' }];
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
    { path: '/niveldetallecurso', icon: 'school', title: 'Gestionar cupo' },
  ];

  Matricula = [
    { path: '/matricula', icon: 'assignment_ind', title: 'Matrícula ' },
  ];

  configuraciones = [
    { path: '/periodo', icon: 'calendar_today', title: 'Crear Periodo' },
    { path: '/nivel', icon: 'school', title: 'Nivel Académico' },
    { path: '/grado-seccion', icon: 'class', title: 'Grado y Sección' },
    { path: '/niveldetalle', icon: 'list', title: 'Cupos ' },
    { path: '/horario', icon: 'schedule', title: 'Horario' },
    { path: '/docentes/detalle', icon: 'assignment_ind', title: 'Docentes y Cursos' },


  ];

  Menu = [

    { path: '/agregar-noticia', icon: 'article', title: 'Agregar Noticia' },
    { path: '/agregar-recurso', icon: 'attach_file', title: 'Agregar Recurso' }
  ];



  AdministrarUsuario = [
    { path: '/registro', icon: 'person_add', title: 'Registrar' },
  ];
  userLinks = [
    { path: '/ventana2', icon: 'grade', title: 'Calificaciones' }, 
    { path: '/curricularDocente', icon: 'book', title: 'Curricular' }, 
    { path: '/horarioDocente', icon: 'schedule', title: 'Horario' }, 
  ];
  
  Ventana3Links = [ 
    { path: '/ventana3', icon: 'grade', title: 'Calificación' },  
    { path: '/curricularEstudiante', icon: 'book', title: 'Contenido Curricular' }, // Libro
    { path: '/horarioEstudiante', icon: 'schedule', title: 'Mi Horario' }, 
    
  ];
  
  
  cargarNotificaciones() {
    this.notificacionService
      .obtenerNotificaciones()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          const nuevasNotificaciones = data.length > this.notifications.length; 
          this.notifications = data.map((n) => n.mensaje);
  
          if (nuevasNotificaciones) {
            this.hasPendingNotifications = true; 
            this.triggerNotificationBlink(); 
          }
        },
        (error) => {
          console.error('Error al cargar notificaciones:', error);
        }
      );
  }
  triggerNotificationBlink() {
    this.isNotificationBlinking = true;
    setTimeout(() => {
      this.isNotificationBlinking = false; 
    }, 5000); 
  }
  notifications: string[] = [];
  isAuthenticated$ = this.authService.isAuthenticated$;
  isAdmin$ = this.authService.isAdmin$;
  isManager$ = this.authService.isManager$;
  currentLinks = [];
  private unsubscribe$ = new Subject<void>();
  userName$ = this.authService.userName$;
 logoUrl = 'assets/iconos/estudiante.png'; 
 logoutIcon: string = 'person'; 
 showLayout: boolean = true;
 constructor(
  private authService: AuthService,
  private dialog: MatDialog,
  private notificacionService: NotificacionService,
  private router: Router
) {
  // Suscripción a los eventos del router para controlar el layout
  this.router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
      this.showLayout = !event.url.includes('/luna'); // Oculta el layout en la ruta /luna
    }
  });
}
abrirIAIcono() {
  const dialogRef = this.dialog.open(IconoIaComponent, {
    panelClass: 'dialog-no-padding', // Clase personalizada
    width: 'auto', // Ajusta automáticamente al contenido
    height: 'auto',
  });

  dialogRef.afterOpened().subscribe(() => {
    console.log('El diálogo se abrió, iniciando voz...');
  });
}

  openNotifications() {
    this.dialog.open(NotificacionesDialogComponent, {
      width: '400px',
      data: { notifications: this.notifications },
    });
    this.hasPendingNotifications = false;
  }
  username: string | null = null;
  ngOnInit() {
    this.cargarNotificaciones();

    // Suscribirse a userName$
    this.authService.userName$.pipe(takeUntil(this.unsubscribe$)).subscribe((name) => {
      this.username = name;
    });

    this.isAdmin$.pipe(takeUntil(this.unsubscribe$)).subscribe((isAdmin) => {
      if (isAdmin) {
        this.currentLinks = [
          ...this.Menu,
          ...this.Alumno,
          ...this.configuraciones,
          ...this.AdministrarUsuario,
          ...this.Matricula,
          ...this.Docente,
          ...this.Curso,
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
  
  this.isManager$.pipe(takeUntil(this.unsubscribe$)).subscribe((isManager) => {
    if (isManager) {
      this.logoutIcon = 'assets/iconos/salir.png'; 
       } else {
      this.logoutIcon = 'assets/iconos/salir.png'; 
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
