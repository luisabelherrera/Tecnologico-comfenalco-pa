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
  mensajeUsuario: string = ''; 
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

irAOtraVentana() {
  this.router.navigate(['/venta-informacion']); // Reemplaza con la ruta deseada
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
}