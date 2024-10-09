import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtResponseDto, LoginDto } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth/AuthService.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginDto: LoginDto = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.errorMessage = ''; 

    this.authService.login(this.loginDto).subscribe(
      (response: JwtResponseDto) => {
        console.log('Login successful! Access Token:', response.accessToken);
  
        const roles: string[] = response.roles || [];
        if (roles.length > 0) {
          if (roles.includes('Administracion')) {
            this.router.navigate(['/home']);
          } else if (roles.includes('Estudiante')) {
            this.router.navigate(['/ventana3']);
          } else {
            this.router.navigate(['/ventana2']);
          }
        } else {
          this.router.navigate(['/login']);
        }
      },
      error => {
        console.error('Login failed!', error);
        this.errorMessage = 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.';
      }
    );
  }
}
