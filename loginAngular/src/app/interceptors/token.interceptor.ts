import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('/auth/signin')) {
            return next.handle(req); // No añadir token para /auth/signin
        }

        const token = localStorage.getItem('token');
        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(cloned).pipe(
                catchError((error) => {
                    console.error('Error in request:', error);
                    // Handle specific error scenarios here
                    return throwError(error);
                })
            );
        }

        return next.handle(req);
    }
}
