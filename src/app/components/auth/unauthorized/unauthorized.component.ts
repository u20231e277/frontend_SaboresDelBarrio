import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
          <lucide-icon name="shield-alert" [size]="48" class="text-red-600"></lucide-icon>
        </div>
        <h2 class="text-3xl font-extrabold text-brand-dark mb-2">Acceso Denegado</h2>
        <p class="text-gray-500 mb-8 max-w-sm mx-auto">
          No tienes los permisos suficientes para acceder a esta sección del sistema. Si crees que esto es un error, por favor contacta a un administrador.
        </p>
        
        <button (click)="goBack()" 
                class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-brand-terra hover:bg-brand-wood transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto">
          <lucide-icon name="home" [size]="20" class="mr-2"></lucide-icon>
          Volver al Inicio
        </button>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class UnauthorizedComponent {
    constructor(private router: Router) { }

    goBack() {
        this.router.navigate(['/dashboard']);
    }
}
