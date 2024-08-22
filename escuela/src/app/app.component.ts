import { Component } from '@angular/core';
import { shareReplay } from 'rxjs/operators';

import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = ' INSTITUCION EDUCATIVA EL HOBO';

  links = [{ path: '/home', icon: 'home', title: 'Home' }];

  Consult = [
    // VENTANA PRINCIPAL
    { path: '/tutor', icon: 'group', title: 'Tutor' },
    { path: '/aulas', icon: 'person_search', title: 'Aula' },
    { path: '/asignaciones-aulas', icon: 'person', title: 'Asignar Aula' },
  ];
  Chat = [
    //VENTANA SECUNDARIA
    { path: '/home', icon: 'person', title: 'Chat' },
  ];

  Exit = [{ path: '', icon: 'exit_to_app', title: 'Exit' }];

  isAuthenticated$ = this.authService.isAuthenticated$.pipe(shareReplay(1));

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
