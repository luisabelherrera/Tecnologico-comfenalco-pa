import { Component, OnInit } from '@angular/core';

import { UserInfo } from '../../models/auth.interface';
import { AuthService } from 'src/app/services/auth/AuthService.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userInfo: UserInfo = {
    email: '',
    password: '',
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  login(userInfo: UserInfo) {
    this.authService.login(userInfo);
  }
}