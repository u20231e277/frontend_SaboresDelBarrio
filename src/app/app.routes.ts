import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryListComponent } from './components/inventory/inventory-list/inventory-list.component';
import { GenericTransactionComponent } from './components/transactions/generic-transaction/generic-transaction.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'inventario', component: InventoryListComponent },
            {
                path: 'ventas',
                component: GenericTransactionComponent,
                data: { type: 'VENTA', title: 'Registro de Ventas' }
            },
            {
                path: 'ventas/clientes',
                loadComponent: () => import('./components/transactions/client-management/client-management.component').then(m => m.ClientManagementComponent)
            },
            {
                path: 'compras',
                component: GenericTransactionComponent,
                data: { type: 'COMPRA', title: 'Registro de Compras' }
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
    }
];
