import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent],
    template: `
    <div class="flex h-screen bg-brand-cream overflow-hidden">
      <!-- Sidebar -->
      <app-sidebar class="w-64 flex-shrink-0 border-r border-brand-wood/10 bg-white"></app-sidebar>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-8 relative">
         <!-- Background decoration -->
         <div class="absolute top-0 right-0 w-64 h-64 bg-brand-terra/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10"></div>

         <div class="max-w-7xl mx-auto">
           <router-outlet></router-outlet>
         </div>
      </main>
    </div>
  `
})
export class MainLayoutComponent { }
