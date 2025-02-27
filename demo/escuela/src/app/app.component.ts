import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from './services/auth/AuthService.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionesDialogComponent } from './components/notificaciones-dialog/notificaciones-dialog.component';
import { NotificacionService } from './services/notificacion/NotificacionService';
import { NavigationStart, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { TemaHeaderService, Theme } from './services/tema-header/tema-header.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = ' HOBO';

  @ViewChild('sidenav') sidenav!: MatSidenav;
  toolbarColor: string | SafeStyle = 'rgb(0, 0, 0)';
  toolbarTextColor: string = 'white';
  logoImage: string = '/assets/iconos/tierra.png';
  isChristmasTheme: boolean = false;
  isMatriculaMenuOpen = false;
  isConfigMenuOpen = false;
  isUserMenuOpen = false;
  isAlumnoMenuOpen = false;
  isDocenteMenuOpen = false;
  isCursoMenuOpen = false;
  isAdministrarUsuarioMenuOpen = false;
  islinksMenuOpen = false;
  isVentana3MenuOpen = false;
  isMenu = false;
  hasPendingNotifications = false;
  isNotificationBlinking = false;
  isButtonPressed = false;
  logoutIcon = '/assets/iconos/salir.png';
  currentLinks: { path: string; icon: string; title: string }[] = [];
  private previousTheme: Theme;
  currentTheme$: Observable<Theme>;

  links = [{ path: '/home', icon: 'assets/iconos/school.png', title: 'Inicio' }];
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
    { path: '/matricula', icon: 'assignment_ind', title: 'Matrícula' },
  ];
  configuraciones = [
    { path: '/periodo', icon: 'calendar_today', title: 'Crear Periodo' },
    { path: '/nivel', icon: 'school', title: 'Nivel Académico' },
    { path: '/grado-seccion', icon: 'class', title: 'Grado y Sección' },
    { path: '/niveldetalle', icon: 'list', title: 'Cupos' },
    { path: '/horario', icon: 'schedule', title: 'Horario' },
    { path: '/docentes/detalle', icon: 'assignment_ind', title: 'Docentes y Cursos' },
  ];
  Menu = [
    { path: '/agregar-noticia', icon: 'post_add', title: 'Agregar Noticia' },
    { path: '/chat-gestion', icon: 'chat', title: 'Gestionar Chat' },
    { path: '/Descripcion', icon: 'edit_note', title: 'Modificar Descripción' },
    { path: '/header', icon: 'web', title: 'Personalizar Header' },
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
    { path: '/perfil-estudiante', icon: 'schedule', title: 'Mi Perfil' },
    { path: '/ventana3', icon: 'grade', title: 'Calificación' },
  
    { path: '/horarioEstudiante', icon: 'schedule', title: 'Mi Horario' },
  ];

  notifications: string[] = [];
  isAuthenticated$ = this.authService.isAuthenticated$;
  isAdmin$ = this.authService.isAdmin$;
  isManager$ = this.authService.isManager$;
  username: string | null = null;
  showLayout = true;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private router: Router,
    private temaHeaderService: TemaHeaderService,
    private sanitizer: DomSanitizer
  ) {
    this.currentTheme$ = this.temaHeaderService.currentTheme$;
    this.temaHeaderService.currentTheme$.pipe(takeUntil(this.unsubscribe$)).subscribe(theme => {
      console.log('Tema recibido en AppComponent:', theme);

      if (theme.backgroundColorLeft && theme.backgroundColorRight) {
        const gradient = `linear-gradient(to right, ${theme.backgroundColorLeft}, ${theme.backgroundColorRight})`;
        this.toolbarColor = this.sanitizer.bypassSecurityTrustStyle(gradient);
      } else {
        this.toolbarColor = theme.backgroundColor || this.toolbarColor;
      }

      this.toolbarTextColor = theme.textColor || this.toolbarTextColor;
      this.isChristmasTheme = theme.name.toLowerCase() === 'navidad';
      document.documentElement.style.setProperty('--theme-background-color', typeof this.toolbarColor === 'string' ? this.toolbarColor : theme.backgroundColor || 'rgb(0, 0, 0)');
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showLayout = !event.url.includes('/luna');
      }
    });
  }

  onImageError(event: Event) {
    console.error('Error al cargar la imagen:', this.logoImage);
    this.logoImage = '/assets/iconos/tierra.png';
  }

  ngOnInit() {
    this.cargarNotificaciones();
    this.authService.userName$.pipe(takeUntil(this.unsubscribe$)).subscribe(name => {
      this.username = name;
    });
    this.isAdmin$.pipe(takeUntil(this.unsubscribe$)).subscribe(isAdmin => {
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
        this.isManager$.pipe(takeUntil(this.unsubscribe$)).subscribe(isManager => {
          this.currentLinks = isManager ? [...this.Ventana3Links] : [...this.userLinks];
        });
      }
    });
    document.documentElement.style.setProperty('--theme-background-color', typeof this.toolbarColor === 'string' ? this.toolbarColor : 'rgb(0, 0, 0)');
  }

  cargarNotificaciones() {
    this.notificacionService
      .obtenerNotificaciones()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        data => {
          const nuevasNotificaciones = data.length > this.notifications.length;
          this.notifications = data.map(n => n.mensaje);
          if (nuevasNotificaciones) {
            this.hasPendingNotifications = true;
            this.triggerNotificationBlink();
          }
        },
        error => console.error('Error al cargar notificaciones:', error)
      );
  }

  triggerNotificationBlink() {
    this.isNotificationBlinking = true;
    setTimeout(() => (this.isNotificationBlinking = false), 5000);
  }

  abrirIAIcono() {
    this.isButtonPressed = !this.isButtonPressed;
    const currentTheme = this.temaHeaderService.getCurrentTheme();

    if (this.isButtonPressed) {
      this.previousTheme = { ...currentTheme };
      this.temaHeaderService.applyTheme({
        ...currentTheme,
        backgroundColor: '#3F51B5',
        textColor: '#F5F5F5',
      });
    } else {
      this.temaHeaderService.applyTheme(this.previousTheme);
    }
  }

  openNotifications() {
    this.dialog.open(NotificacionesDialogComponent, {
      width: '400px',
      data: { notifications: this.notifications },
    });
    this.hasPendingNotifications = false;
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  onSidenavToggle(opened: boolean) {
    // Forzar recalculo del layout
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300); // Coincide con la duración de la transición
  }

}