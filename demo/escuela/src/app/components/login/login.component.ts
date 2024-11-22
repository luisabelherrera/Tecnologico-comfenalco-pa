import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/AuthService.service';
import { NotificacionService } from 'src/app/services/notificacion/NotificacionService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginDto = { email: '', password: '' };
  mensajeUsuario: string = ''; // Mensaje a enviar al administrador
  mostrarModal: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {}

  login() {
    this.authService.login(this.loginDto).subscribe(
      (response) => {
        const roles: string[] = response.roles || [];
        if (roles.includes('Administracion')) {
          this.router.navigate(['/home']);
        } else if (roles.includes('Estudiante')) {
          this.router.navigate(['/ventana3']);
        } else {
          this.router.navigate(['/ventana2']);
        }
      },
      (error) => {
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      }
    );
  }

  abrirModalRecuperacion() {
    this.mostrarModal = true; // Muestra el modal
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.mensajeUsuario = ''; // Limpia el mensaje al cerrar
  }

  enviarMensaje() {
    if (!this.mensajeUsuario.trim()) {
        alert('Por favor, escribe un mensaje.');
        return;
    }

    console.log("Mensaje enviado:", this.mensajeUsuario);  // Imprime el mensaje

    this.notificacionService.notificarAdministrador(this.mensajeUsuario).subscribe(
        (response) => {
            console.log("Respuesta del servidor:", response);  // Verifica la respuesta
            alert('Mensaje enviado al administrador.');
            this.cerrarModal();
        },
        (error) => {
            console.error("Error al enviar el mensaje:", error);
            alert('Hubo un problema al procesar la solicitud. Inténtalo de nuevo más tarde.');
        }
    );
}
}