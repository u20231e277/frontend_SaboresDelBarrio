import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = 'http://localhost:8080';
    private readonly TOKEN_KEY = 'jwtToken';

    private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
    isLoggedIn$ = this.loggedIn.asObservable();

    constructor() { }

    login(credentials: { username: string; password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response && response.jwtToken) {
                    this.saveToken(response.jwtToken);
                    this.loggedIn.next(true);
                }
            })
        );
    }

    logout(): void {
        this.removeToken();
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        return this.hasToken();
    }

    getToken(): string | null {
        if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    private saveToken(token: string): void {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    private removeToken(): void {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem(this.TOKEN_KEY);
        }
    }

    private hasToken(): boolean {
        return !!this.getToken();
    }

    getUserRoles(): string[] {
        const token = this.getToken();
        if (!token) return [];

        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            const parsedPayload = JSON.parse(decodedPayload);

            let rolesArray: any[] = [];
            if (Array.isArray(parsedPayload.roles)) {
                rolesArray = parsedPayload.roles;
            } else if (typeof parsedPayload.roles === 'string') {
                rolesArray = [parsedPayload.roles];
            } else if (Array.isArray(parsedPayload.authorities)) {
                rolesArray = parsedPayload.authorities;
            } else if (typeof parsedPayload.role === 'string') {
                rolesArray = [parsedPayload.role];
            }

            // Normalize and extract strings
            return rolesArray.map(r => {
                if (typeof r === 'string') return r;
                if (r && r.authority) return r.authority;
                if (r && r.name) return r.name;
                return String(r);
            });
        } catch (e) {
            console.error('Error decoding JWT token');
            return [];
        }
    }

    hasRole(expectedRole: string): boolean {
        const roles = this.getUserRoles();
        const expected = expectedRole.toUpperCase();
        return roles.some(role => {
            const r = role.toUpperCase();
            return r === expected || r === `ROLE_${expected}` || r.replace('ROLE_', '') === expected;
        });
    }
}
