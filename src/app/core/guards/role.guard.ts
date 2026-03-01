import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const expectedRoles = route.data?.['roles'] as Array<string>;

    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    if (!expectedRoles || expectedRoles.length === 0) {
        return true;
    }

    const hasRole = expectedRoles.some(role => authService.hasRole(role));

    if (!hasRole) {
        // Redirect to an unauthorized page
        router.navigate(['/unauthorized']);
        return false;
    }

    return true;
};
