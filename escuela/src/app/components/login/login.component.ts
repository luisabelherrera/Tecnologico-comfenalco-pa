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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

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
}
