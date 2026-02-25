import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, ShoppingCart, Package, BarChart3, ChefHat } from 'lucide-angular';

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

        <a routerLink="/ventas" routerLinkActive="bg-brand-terra/10 text-brand-terra font-medium"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-brand-wood transition-all duration-200 group">
           <lucide-icon name="shopping-cart" [size]="20" class="group-hover:text-brand-terra transition-colors"></lucide-icon>
           <span>Ventas</span>
        </a>

        <a routerLink="/compras" routerLinkActive="bg-brand-terra/10 text-brand-terra font-medium"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-brand-wood transition-all duration-200 group">
           <lucide-icon name="bar-chart-3" [size]="20" class="group-hover:text-brand-terra transition-colors"></lucide-icon>
           <span>Compras</span>
        </a>

        <div class="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Gestión</div>

        <a routerLink="/inventario" routerLinkActive="bg-brand-terra/10 text-brand-terra font-medium"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-brand-wood transition-all duration-200 group">
           <lucide-icon name="package" [size]="20" class="group-hover:text-brand-terra transition-colors"></lucide-icon>
           <span>Inventario</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-100">
        <div class="flex items-center gap-3 p-3 rounded-xl bg-brand-cream/50">
           <div class="w-8 h-8 rounded-full bg-brand-wood text-white flex items-center justify-center font-bold text-xs">AD</div>
           <div class="text-sm">
             <p class="font-medium text-brand-dark">Admin User</p>
             <p class="text-xs text-gray-500">Gerente</p>
           </div>
        </div>
      </div>
    </div>
  `
})
export class SidebarComponent { }
