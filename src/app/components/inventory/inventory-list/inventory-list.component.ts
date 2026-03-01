import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { AuthService } from '../../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { Observable } from 'rxjs';
import { Insumo } from '../../../models/insumo.model';
import { SupplyDTO } from '../../../models/api-dtos.model';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-brand-dark">Inventario de Insumos</h2>
        <button *ngIf="hasRole('JEFE_DE_COCINA') || hasRole('ADMINISTRADOR')" (click)="showCreateForm = !showCreateForm" class="bg-brand-terra text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-wood transition-colors flex items-center gap-2">
           <lucide-icon name="package" [size]="18"></lucide-icon>
           {{ showCreateForm ? 'Cancelar' : 'Nuevo Insumo' }}
        </button>
      </div>

      <!-- Simple Create Form -->
      <div *ngIf="showCreateForm" class="bg-white p-6 rounded-2xl shadow-lg border-2 border-brand-terra/20 mb-6 animate-in fade-in slide-in-from-top-4">
         <h3 class="font-bold text-brand-dark mb-4">Registrar Nuevo Insumo</h3>
         <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
               <label class="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
               <input [(ngModel)]="newSupply.nameSupply" type="text" class="w-full p-2 rounded-lg border border-gray-200 outline-none focus:border-brand-terra" placeholder="Ej. Arroz Costeño">
            </div>
            <div>
               <label class="block text-xs font-medium text-gray-500 mb-1">Unidad</label>
               <select [(ngModel)]="newSupply.unitSupply" class="w-full p-2 rounded-lg border border-gray-200 outline-none focus:border-brand-terra">
                  <option value="" disabled>Seleccione</option>
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="lt">Litros (lt)</option>
                  <option value="un">Unidad (un)</option>
               </select>
            </div>
             <div>
               <label class="block text-xs font-medium text-gray-500 mb-1">Cat. ID (Temp)</label>
               <input [(ngModel)]="newSupply.idCategory" type="number" class="w-full p-2 rounded-lg border border-gray-200 outline-none focus:border-brand-terra" placeholder="1">
            </div>
            <div>
               <label class="block text-xs font-medium text-gray-500 mb-1">Vida Útil (días)</label>
               <input [(ngModel)]="newSupply.usefulLiSupply" type="number" class="w-full p-2 rounded-lg border border-gray-200 outline-none focus:border-brand-terra" placeholder="30">
            </div>
         </div>
         <div class="mt-4 flex justify-end">
            <button (click)="saveInsumo()" [disabled]="!newSupply.nameSupply || !newSupply.unitSupply" class="bg-brand-dark text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-wood transition-colors disabled:opacity-50">
               Guardar Insumo
            </button>
         </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-brand-wood/5 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-brand-cream/30 border-b border-brand-wood/10">
              <tr>
                <th class="px-6 py-4 font-semibold text-brand-wood text-sm">ID</th>
                <th class="px-6 py-4 font-semibold text-brand-wood text-sm">Nombre</th>
                <th class="px-6 py-4 font-semibold text-brand-wood text-sm">Categoría</th>
                <th class="px-6 py-4 font-semibold text-brand-wood text-sm">Stock Actual</th>
                <th class="px-6 py-4 font-semibold text-brand-wood text-sm">Estado</th>
                <th class="px-6 py-4 font-semibold text-brand-wood text-sm">Unidad</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let item of insumos$ | async" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-gray-500">#{{ item.id_insumo }}</td>
                <td class="px-6 py-4 font-medium text-brand-dark">{{ item.nombre }}</td>
                <td class="px-6 py-4 text-gray-600">Cat {{ item.id_categoria_insumo }}</td>
                <td class="px-6 py-4 font-bold text-brand-dark">{{ item.stock__actual }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-green-100 text-green-700': item.estado__conservacion === 'Suficiente',
                          'bg-red-100 text-red-700': item.estado__conservacion === 'Reabastecer'
                        }">
                     {{ item.estado__conservacion }}
                  </span>
                </td>
                 <td class="px-6 py-4 text-gray-500">{{ item.unidad }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class InventoryListComponent {
  inventoryService = inject(InventoryService);
  authService = inject(AuthService);
  insumos$: Observable<Insumo[]> = this.inventoryService.getInsumos();

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  showCreateForm = false;
  newSupply: SupplyDTO = {
    idCategory: 1, // Default to 1 if user doesn't know
    nameSupply: '',
    unitSupply: '',
    usefulLiSupply: 30
  };

  saveInsumo() {
    if (!this.newSupply.nameSupply) return;

    this.inventoryService.createSupply(this.newSupply).subscribe({
      next: (res: SupplyDTO) => {
        alert('Insumo creado: ' + res.nameSupply);
        this.showCreateForm = false;
        // Reset form
        this.newSupply = { idCategory: 1, nameSupply: '', unitSupply: '', usefulLiSupply: 30 };
        // Refresh list
        this.insumos$ = this.inventoryService.getInsumos();
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al crear insumo');
      }
    });
  }
}
