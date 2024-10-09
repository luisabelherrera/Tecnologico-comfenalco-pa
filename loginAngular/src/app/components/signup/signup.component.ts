import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signUpData = { name: '', email: '', password: '', role: 'USER' };

  constructor(private authService: AuthService, private router: Router) {} // Inject Router

  signUp() {
    console.log('Datos de registro:', this.signUpData);
    this.authService.signUp(this.signUpData).subscribe(
      response => {
        console.log('Usuario registrado:', response);
        this.router.navigate(['/signin']); // Redirige al login o cualquier otra página
      },
      error => {
        console.error('Error en el registro:', error);
        if (error.status === 409) {
          alert('Este email ya está en uso. Por favor, elige otro.');
        } else {
          alert('Error al registrar el usuario. Intenta de nuevo más tarde.');
        }
      }
    );
  }
}
