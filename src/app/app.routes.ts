import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryListComponent } from './components/inventory/inventory-list/inventory-list.component';
import { GenericTransactionComponent } from './components/transactions/generic-transaction/generic-transaction.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'inventario',
                component: InventoryListComponent,
                canActivate: [roleGuard],
                data: { roles: ['JEFE_DE_COCINA', 'ADMINISTRADOR'] }
            },
            {
                path: 'ventas',
                component: GenericTransactionComponent,
                canActivate: [roleGuard],
                data: { type: 'VENTA', title: 'Registro de Ventas', roles: ['MOZO', 'ADMINISTRADOR'] }
            },
            {
                path: 'ventas/clientes',
                loadComponent: () => import('./components/transactions/client-management/client-management.component').then(m => m.ClientManagementComponent),
                canActivate: [roleGuard],
                data: { roles: ['MOZO', 'ADMINISTRADOR'] }
            },
            {
                path: 'compras',
                component: GenericTransactionComponent,
                canActivate: [roleGuard],
                data: { type: 'COMPRA', title: 'Registro de Compras', roles: ['JEFE_DE_COCINA', 'ADMINISTRADOR'] }
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'unauthorized',
        loadComponent: () => import('./components/auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
    },
    { path: '**', redirectTo: 'dashboard' } // Fallback generic
];
