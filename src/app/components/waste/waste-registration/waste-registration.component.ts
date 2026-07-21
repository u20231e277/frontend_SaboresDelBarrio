import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';
import { InventoryService } from '../../../services/inventory.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';
import { Insumo } from '../../../models/insumo.model';
import { UserDTO, WasteDTO } from '../../../models/api-dtos.model';

@Component({
  selector: 'app-waste-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-brand-dark">Registro de Mermas</h2>
      </div>

      <form [formGroup]="form" (ngSubmit)="saveWastes()" class="space-y-6">
        <section class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5">
          <h3 class="font-bold text-brand-wood mb-4 text-lg border-b border-gray-100 pb-2">Información General</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Fecha</label>
              <input type="date" formControlName="fecha" class="w-full p-2.5 rounded-lg border border-gray-200 focus:border-brand-terra focus:ring-1 focus:ring-brand-terra outline-none transition-all">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Responsable</label>
              <select formControlName="responsable" class="w-full p-2.5 rounded-lg border border-gray-200 focus:border-brand-terra outline-none">
                <option value="" disabled>Seleccione Responsable</option>
                <option *ngFor="let user of users" [ngValue]="user.idUser">
                  {{ user.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Observaciones</label>
              <input type="text" formControlName="observaciones" placeholder="Observaciones generales (opcional)" class="w-full p-2.5 rounded-lg border border-gray-200 focus:border-brand-terra focus:ring-1 focus:ring-brand-terra outline-none transition-all">
            </div>
          </div>
        </section>

        <section class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5">
          <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
            <h3 class="font-bold text-brand-wood text-lg">Detalle de Mermas</h3>
            <button type="button" (click)="addRow()" class="text-brand-terra font-medium hover:text-brand-wood flex items-center gap-1 text-sm bg-brand-terra/10 px-3 py-1 rounded-lg">
              <lucide-icon name="plus" [size]="16"></lucide-icon>
              Agregar Fila
            </button>
          </div>

          <div formArrayName="detalles" class="space-y-4">
            <div *ngFor="let row of detailRows.controls; let i = index" [formGroupName]="i" class="grid grid-cols-1 xl:grid-cols-[1.45fr_.8fr_1.35fr_.65fr_.65fr_.85fr_1fr_auto] gap-4 items-end p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Producto o Insumo</label>
                <select formControlName="idSupplyWaste" (change)="syncSupplyUnit(i)" class="w-full p-2 rounded-lg border border-gray-200">
                  <option [ngValue]="null" disabled>Seleccione Producto</option>
                  <option *ngFor="let supply of supplies" [ngValue]="supply.id_insumo">
                    {{ supply.nombre }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
                <input type="text" [value]="getCategory(row.value.idSupplyWaste)" readonly class="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-500">
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Motivo de Merma</label>
                <select formControlName="reasonWaste" class="w-full p-2 rounded-lg border border-gray-200">
                  <option value="" disabled>Seleccione Motivo</option>
                  <option value="Vencimiento">Vencimiento</option>
                  <option value="Daño en preparacion">Daño en preparacion</option>
                  <option value="Sobrante no reutilizable">Sobrante no reutilizable</option>
                  <option value="Merma por manipulacion">Merma por manipulacion</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
                <input type="number" min="0.01" step="0.01" formControlName="quantityWaste" class="w-full p-2 rounded-lg border border-gray-200">
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Unidad</label>
                <input type="text" formControlName="unit" readonly class="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-500">
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Costo estimado</label>
                <div class="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
                  <span class="px-3 py-2 bg-gray-50 text-gray-500 border-r border-gray-200">S/</span>
                  <input type="number" min="0" step="0.10" formControlName="estimatedCost" class="w-full p-2 outline-none">
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Observaciones</label>
                <input type="text" formControlName="detailNotes" placeholder="Opcional" class="w-full p-2 rounded-lg border border-gray-200">
              </div>

              <button type="button" (click)="removeRow(i)" class="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Eliminar fila">
                <lucide-icon name="trash-2" [size]="18"></lucide-icon>
              </button>
            </div>
          </div>
        </section>

        <div class="flex justify-end">
          <div class="bg-brand-dark text-white p-6 rounded-2xl w-full md:w-80 shadow-lg">
            <div class="flex justify-between mb-3 opacity-80">
              <span>Total de Mermas (items)</span>
              <span>{{ totalItems }}</span>
            </div>
            <div class="flex justify-between mb-4 opacity-80">
              <span>Total Estimado</span>
              <span>S/ {{ totalCost | number:'1.2-2' }}</span>
            </div>
            <div class="flex justify-between text-2xl font-bold pt-4 border-t border-white/20">
              <span>Total</span>
              <span>S/ {{ totalCost | number:'1.2-2' }}</span>
            </div>

            <button type="submit" [disabled]="form.invalid || isSaving" class="w-full mt-6 bg-brand-terra hover:bg-white hover:text-brand-terra text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <lucide-icon name="save" [size]="20"></lucide-icon>
              {{ isSaving ? 'Guardando...' : 'Guardar Operación' }}
            </button>
          </div>
        </div>
      </form>

      <div *ngIf="successMessage" class="fixed bottom-6 right-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
        <lucide-icon name="check-circle-2" [size]="18"></lucide-icon>
        {{ successMessage }}
      </div>

      <div *ngIf="errorMessage" class="fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
        <lucide-icon name="alert-circle" [size]="18"></lucide-icon>
        {{ errorMessage }}
      </div>
    </div>
  `
})
export class WasteRegistrationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private inventoryService = inject(InventoryService);
  private userService = inject(UserService);

  supplies: Insumo[] = [];
  users: UserDTO[] = [];
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  form = this.fb.group({
    fecha: [new Date().toISOString().substring(0, 10), Validators.required],
    responsable: [null as number | null, Validators.required],
    observaciones: [''],
    detalles: this.fb.array([])
  });

  ngOnInit() {
    this.addRow();
    this.inventoryService.getInsumos().subscribe(data => {
      this.supplies = data;
      this.syncSupplyUnit(0);
    });
    this.userService.getUsers().subscribe(data => {
      this.users = data.filter(user => user.idRoleUser === 1 || user.idRoleUser === 3);
    });
  }

  get detailRows() {
    return this.form.get('detalles') as FormArray;
  }

  get totalItems(): number {
    return this.detailRows.controls.length;
  }

  get totalCost(): number {
    return this.detailRows.controls.reduce((sum, row) => {
      return sum + Number(row.get('estimatedCost')?.value || 0);
    }, 0);
  }

  addRow() {
    this.detailRows.push(this.fb.group({
      idSupplyWaste: [null as number | null, Validators.required],
      reasonWaste: ['', Validators.required],
      quantityWaste: [0, [Validators.required, Validators.min(0.01)]],
      unit: [''],
      estimatedCost: [0, [Validators.required, Validators.min(0)]],
      detailNotes: ['']
    }));
  }

  removeRow(index: number) {
    if (this.detailRows.length === 1) return;
    this.detailRows.removeAt(index);
  }

  syncSupplyUnit(index: number) {
    const row = this.detailRows.at(index);
    const selected = this.supplies.find(item => item.id_insumo === Number(row?.get('idSupplyWaste')?.value));
    row?.get('unit')?.setValue(selected?.unidad || '');
  }

  getCategory(idSupply?: number): string {
    const selected = this.supplies.find(item => item.id_insumo === Number(idSupply));
    return selected ? `Cat ${selected.id_categoria_insumo}` : 'Seleccione Categoria';
  }

  saveWastes() {
    if (this.form.invalid || this.isSaving) return;

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const date = `${this.form.value.fecha}T00:00:00`;
    const requests = this.detailRows.controls.map(row => {
      const payload: WasteDTO = {
        dateWaste: date,
        idSupplyWaste: Number(row.get('idSupplyWaste')?.value),
        quantityWaste: Number(row.get('quantityWaste')?.value),
        reasonWaste: String(row.get('reasonWaste')?.value)
      };

      return this.http.post<WasteDTO>(`${environment.apiUrl}/wastes`, payload).pipe(
        catchError(() => of(null))
      );
    });

    forkJoin(requests).subscribe(results => {
      this.isSaving = false;
      if (results.every(Boolean)) {
        this.successMessage = 'Operación registrada correctamente.';
        this.detailRows.clear();
        this.addRow();
        this.form.patchValue({
          fecha: new Date().toISOString().substring(0, 10),
          responsable: null,
          observaciones: ''
        });
      } else {
        this.errorMessage = 'No se pudo registrar la operacion. Revise los datos ingresados.';
      }

      setTimeout(() => {
        this.successMessage = '';
        this.errorMessage = '';
      }, 3500);
    });
  }
}
