import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="flex flex-col h-full bg-white shadow-xl shadow-brand-wood/5">
      <!-- Header -->
      <div class="p-6 flex items-center gap-3 border-b border-gray-100">
        <div class="p-2 bg-brand-terra/10 rounded-lg text-brand-terra">
          <lucide-icon name="chef-hat" [size]="24"></lucide-icon>
        </div>
        <div>
          <h1 class="font-bold text-lg text-brand-dark leading-tight">SABORES<br/>DEL BARRIO</h1>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1">
        <a routerLink="/dashboard" routerLinkActive="bg-brand-terra/10 text-brand-terra font-medium" 
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-brand-wood transition-all duration-200 group">
           <lucide-icon name="layout-dashboard" [size]="20" class="group-hover:text-brand-terra transition-colors"></lucide-icon>
           <span>Dashboard</span>
        </a>

        <div class="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Operaciones</div>

        <a *ngIf="hasRole('MOZO') || hasRole('ADMINISTRADOR')" routerLink="/ventas" routerLinkActive="bg-brand-terra/10 text-brand-terra font-medium"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-brand-wood transition-all duration-200 group">
           <lucide-icon name="shopping-cart" [size]="20" class="group-hover:text-brand-terra transition-colors"></lucide-icon>
           <span>Ventas</span>
        </a>

        <a *ngIf="hasRole('JEFE_DE_COCINA') || hasRole('ADMINISTRADOR')" routerLink="/compras" routerLinkActive="bg-brand-terra/10 text-brand-terra font-medium"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-brand-wood transition-all duration-200 group">
           <lucide-icon name="bar-chart-3" [size]="20" class="group-hover:text-brand-terra transition-colors"></lucide-icon>
           <span>Compras</span>
        </a>

        <div *ngIf="hasRole('JEFE_DE_COCINA') || hasRole('ADMINISTRADOR') || hasRole('MOZO')" class="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Gestión</div>

        <a *ngIf="hasRole('JEFE_DE_COCINA') || hasRole('ADMINISTRADOR') || hasRole('MOZO')" routerLink="/inventario" routerLinkActive="bg-brand-terra/10 text-brand-terra font-medium"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-brand-wood transition-all duration-200 group">
           <lucide-icon name="package" [size]="20" class="group-hover:text-brand-terra transition-colors"></lucide-icon>
           <span>Inventario</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-100 flex flex-col gap-2">
        <div class="flex items-center gap-3 p-3 rounded-xl bg-brand-cream/50">
           <div class="w-8 h-8 rounded-full bg-brand-wood text-white flex items-center justify-center font-bold text-xs uppercase">{{ userRole.substring(0,2) || 'U' }}</div>
           <div class="text-sm flex-1">
             <p class="font-medium text-brand-dark">Usuario</p>
             <p class="text-xs text-gray-500 capitalize">{{ userRole.toLowerCase().replace('_', ' ') || 'Autenticado' }}</p>
           </div>
           
           <button (click)="logout()" title="Cerrar sesión" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <lucide-icon name="log-out" [size]="18"></lucide-icon>
           </button>
        </div>
      </div>
    </div>
  `
})
export class SidebarComponent implements OnInit {
  authService = inject(AuthService);
  userRole = '';

  ngOnInit() {
    const roles = this.authService.getUserRoles();
    if (roles && roles.length > 0) {
      if (roles.includes('ADMINISTRADOR')) this.userRole = 'ADMINISTRADOR';
      else if (roles.includes('JEFE_DE_COCINA')) this.userRole = 'JEFE_DE_COCINA';
      else if (roles.includes('MOZO')) this.userRole = 'MOZO';
      else this.userRole = roles[0];
    }
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  logout() {
    this.authService.logout();
  }
}
