import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/AuthService.service';
import { NotificacionService } from 'src/app/services/notificacion/NotificacionService';
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
  mensajeUsuario: string = '';
  mensajeInformacion: string = '';
  mostrarModal: boolean = false;
  mostrarModalInformacion: boolean = false;
  errorMessage: string = '';
  currentTheme$: Observable<Theme>;
  isLoggingIn: boolean = false; // Nueva bandera para controlar la animación

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificacionService: NotificacionService,
    private temaHeaderService: TemaHeaderService,
    private fb: FormBuilder
  ) {
    this.currentTheme$ = this.temaHeaderService.currentTheme$;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  ngOnInit(): void {}

  login() {
    if (this.loginForm.valid) {
      this.isLoggingIn = true; // Activa la animación de salida
      const loginDto = this.loginForm.value;
      this.authService.login(loginDto).subscribe(
        (response) => {
          const roles: string[] = response.roles || [];
          // Espera a que la animación termine antes de navegar
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
          }, 300); // Coincide con la duración de la animación
        },
        (error) => {
          this.isLoggingIn = false; // Cancela la animación si hay error
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

    console.log('Mensaje enviado:', this.mensajeUsuario);
    this.notificacionService.notificarAdministrador(this.mensajeUsuario).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        alert('Mensaje enviado al administrador.');
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al enviar el mensaje:', error);
        alert('Hubo un problema al procesar la solicitud. Inténtalo de nuevo más tarde.');
      }
    );
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

    console.log('Mensaje de información enviado:', this.mensajeInformacion);
    this.notificacionService.notificarAdministrador(this.mensajeInformacion).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        alert('Mensaje enviado al administrador.');
        this.cerrarModalInformacion();
      },
      (error) => {
        console.error('Error al enviar el mensaje:', error);
        alert('Hubo un problema al procesar la solicitud. Inténtalo de nuevo más tarde.');
      }
    );
  }
}