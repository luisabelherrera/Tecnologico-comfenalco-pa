import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  signInData = { email: '', password: '' };
  errorMessage: string | null = null;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  signIn() {
    console.log('Datos de inicio de sesión:', this.signInData);
    this.errorMessage = null; // Reset error message
    this.isLoading = true; // Set loading state

    this.authService.signIn(this.signInData).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        this.isLoading = false; // Reset loading state
        if (response.ourUsers) {
          console.log('Rol del usuario:', response.ourUsers.role);
          this.authService.handleSignInResponse(response);
          
          // Solo redirigir si el rol es ADMIN
          if (response.ourUsers.role === 'ADMIN') {
            console.log('Navegando a: /signup');
            this.router.navigate(['/signup']);
          } else {
            console.log('Rol no permitido, no se redirige.');
            this.errorMessage = 'Acceso denegado. Solo los administradores pueden acceder.';
          }
        } else {
          this.errorMessage = 'No se recibió información de usuario.';
        }
      },
      error => {
        this.isLoading = false; // Reset loading state
        console.error('Error en el inicio de sesión:', error);
        this.errorMessage = 'Credenciales inválidas o error al iniciar sesión.';
      }
    );
  }
}
