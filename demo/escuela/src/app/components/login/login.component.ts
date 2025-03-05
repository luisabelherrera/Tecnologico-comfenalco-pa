import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/AuthService.service';
import { NotificacionService } from 'src/app/services/notificacion/NotificacionService';
import { Observable } from 'rxjs';
import { Theme, TemaHeaderService } from 'src/app/services/tema-header/tema-header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  mensajeUsuario: string = '';
  mensajeInformacion: string = ''; // Para el modal de información
  mostrarModal: boolean = false;
  mostrarModalInformacion: boolean = false; // Para el modal de información
  errorMessage: string = '';
  currentTheme$: Observable<Theme>;

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
      remember: [false]
    });
  }

  ngOnInit(): void {}

  login() {
    if (this.loginForm.valid) {
      const loginDto = this.loginForm.value;
      this.authService.login(loginDto).subscribe(
        (response) => {
          const roles: string[] = response.roles || [];
          this.router.navigate(['/home']).then(() => {
            setTimeout(() => {
              if (roles.includes('Administracion')) {
                this.router.navigate(['/home']);
              } else if (roles.includes('Estudiante')) {
                this.router.navigate(['/home']);
              } else {
                this.router.navigate(['/ventana2']);
              }
            }, 1000);
          });
        },
        (error) => {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        }
      );
    }
  }

  volver() {
    this.router.navigate(['/venta-informacion']);
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

    console.log("Mensaje enviado:", this.mensajeUsuario);
    this.notificacionService.notificarAdministrador(this.mensajeUsuario).subscribe(
      (response) => {
        console.log("Respuesta del servidor:", response);
        alert('Mensaje enviado al administrador.');
        this.cerrarModal();
      },
      (error) => {
        console.error("Error al enviar el mensaje:", error);
        alert('Hubo un problema al procesar la solicitud. Inténtalo de nuevo más tarde.');
      }
    );
  }

  // Lógica para el modal de información
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

    console.log("Mensaje de información enviado:", this.mensajeInformacion);
    this.notificacionService.notificarAdministrador(this.mensajeInformacion).subscribe(
      (response) => {
        console.log("Respuesta del servidor:", response);
        alert('Mensaje enviado al administrador.');
        this.cerrarModalInformacion();
      },
      (error) => {
        console.error("Error al enviar el mensaje:", error);
        alert('Hubo un problema al procesar la solicitud. Inténtalo de nuevo más tarde.');
      }
    );
  }
}