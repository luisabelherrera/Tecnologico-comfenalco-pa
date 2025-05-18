import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/AuthService.service';
import { NotificacionService, Notificacion } from 'src/app/services/notificacion/NotificacionService';
import { Observable } from 'rxjs';
import { Theme, TemaHeaderService } from 'src/app/services/tema-header/tema-header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(20px)' })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  tituloUsuario: string = ''
   tituloInformacion: string = '';
  mensajeUsuario: string = '';
  mensajeInformacion: string = '';
  mostrarModal: boolean = false;
  mostrarModalInformacion: boolean = false;
  errorMessage: string = '';
  currentTheme$: Observable<Theme>;
  isLoggingIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificacionService: NotificacionService,
    private temaHeaderService: TemaHeaderService,
    private fb: FormBuilder
  ) {
    this.currentTheme$ = this.temaHeaderService.currentTheme$;
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  ngOnInit(): void {}

  login() {
    if (this.loginForm.valid) {
      this.isLoggingIn = true;
      const loginDto = this.loginForm.value;
      this.authService.login(loginDto).subscribe(
        (response) => {
          const roles: string[] = response.roles || [];
          setTimeout(() => {
            this.router.navigate(['/home']).then(() => {
              setTimeout(() => {
                if (roles.includes('Administracion')) {
                  this.router.navigate(['/home']);
                } else if (roles.includes('Estudiante')) {
                  this.router.navigate(['/home']);
                } else {
                  this.router.navigate(['/home']);
                }
              }, 1000);
            });
          }, 300);
        },
        (error) => {
          this.isLoggingIn = false;
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        }
      );
    }
  }

  volver() {
    setTimeout(() => {
      this.router.navigate(['/venta-informacion']);
    }, 300);
  }

  abrirModalRecuperacion() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.mensajeUsuario = '';
  }

  enviarMensaje() {
    if (!this.mensajeUsuario.trim()) {
      alert('Por favor, escribe un mensaje.');
      return;
    }

    const notificacion: Partial<Notificacion> = {
      titulo: 'Solicitud de recuperación de contraseña',
      mensaje: this.mensajeUsuario,
      leida: false
    };

    this.notificacionService.notificarAdministrador(notificacion).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        alert('Mensaje enviado al administrador.');
        this.cerrarModal();
      },
      error: (error) => {
        console.error('Error al enviar el mensaje:', error);
        if (error.status === 400) {
          alert('Error: Los datos enviados son inválidos. Asegúrate de incluir un título y mensaje válidos.');
        } else if (error.status === 401) {
          alert('Error: No estás autorizado. Por favor, intenta de nuevo.');
        } else {
          alert('Hubo un problema al procesar la solicitud. Inténtalo de nuevo más tarde.');
        }
      }
    });
  }

  abrirModalInformacion() {
    this.mostrarModalInformacion = true;
  }

  cerrarModalInformacion() {
    this.mostrarModalInformacion = false;
    this.mensajeInformacion = '';
  }

  enviarMensajeInformacion() {
    if (!this.mensajeInformacion.trim()) {
      alert('Por favor, escribe un mensaje.');
      return;
    }

    const notificacion: Partial<Notificacion> = {
      titulo: 'Consulta de información',
      mensaje: this.mensajeInformacion,
      leida: false
    };

    this.notificacionService.notificarAdministrador(notificacion).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        alert('Mensaje enviado al administrador.');
        this.cerrarModalInformacion();
      },
      error: (error) => {
        console.error('Error al enviar el mensaje:', error);
        if (error.status === 400) {
          alert('Error: Los datos enviados son inválidos. Asegúrate de incluir un título y mensaje válidos.');
        } else if (error.status === 401) {
          alert('Error: No estás autorizado. Por favor, intenta de nuevo.');
        } else {
          alert('Hubo un problema al procesar la solicitud. Inténtalo de nuevo más tarde.');
        }
      }
    });
  }
}