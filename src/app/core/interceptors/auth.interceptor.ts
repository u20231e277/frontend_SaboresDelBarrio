import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Public routes that don't need a token
    const publicRoutes = [
        '/login',
        '/rest/',
        '/categories/',
        '/swagger-ui/',
        '/v3/api-docs/'
    ];

    // Check if the request URL matches any public route
    const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

    let authReq = req;
    const token = authService.getToken();

    if (token && !isPublicRoute && req.method !== 'OPTIONS') {
        authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Unauthorized
                authService.logout();
            } else if (error.status === 403) {
                // Forbidden
                alert('No tienes permisos para realizar esta acción.');
                // Optionally redirect to a forbidden page or just stay
            }
            return throwError(() => error);
        })
    );
};
