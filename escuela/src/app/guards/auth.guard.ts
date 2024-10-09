import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/AuthService.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated$.pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          const userRoles = this.authService.getUserRole();
          const allowedRoles = route.data['roles'] as string[]; // Obtener los roles permitidos de las rutas

          if (allowedRoles.some(role => userRoles.includes(role))) {
            return true; // Permitir el acceso si el usuario tiene un rol permitido
          } else {
            this.router.navigate(['/not-authorized']); // Redirigir si no tiene el rol adecuado
            return false;
          }
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
