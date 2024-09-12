import { Component } from '@angular/core';
import { JwtResponseDto, LoginDto, RegisterDto, RoleDto } from '../models';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginDto: LoginDto = { email: '', password: '' };
  registerDto: RegisterDto = { username: '', email: '', password: '', roles: [] };
  availableRoles: RoleDto[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.authService.getRoles().subscribe(
      (roles: RoleDto[]) => {
        this.availableRoles = roles;
      },
      error => {
        console.error('Failed to load roles', error);
      }
    );
  }

  login() {
    this.authService.login(this.loginDto).subscribe(
      (response: JwtResponseDto) => {
        console.log('Login successful! Access Token:', response.accessToken);
        localStorage.setItem('accessToken', response.accessToken);
        this.router.navigate(['/home']); // Cambia '/home' a la ruta que desees
      },
      error => {
        console.error('Login failed!', error);
      }
    );
  }

  register() {
    this.authService.register(this.registerDto).subscribe(
      response => {
        console.log('Registration successful!', response);
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Registration failed!', error);
      }
    );
  }
}