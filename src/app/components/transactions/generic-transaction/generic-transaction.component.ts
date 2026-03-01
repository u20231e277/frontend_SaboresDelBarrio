import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SalesService } from '../../../services/sales.service';
import { PurchaseService } from '../../../services/purchase.service';
import { InventoryService } from '../../../services/inventory.service';
import { LucideAngularModule } from 'lucide-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SaleDTO, BuyDTO, SaleDetailDTO, BuyDetailDTO } from '../../../models/api-dtos.model';

@Component({
   selector: 'app-header-detail-form',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
   template: `
    <div class="space-y-6 relative">
       <!-- Title -->
       <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-brand-dark">{{ title }}</h2>
       </div>

       <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Header Section -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5">
             <h3 class="font-bold text-brand-wood mb-4 text-lg border-b border-gray-100 pb-2">Información General</h3>
             <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label class="block text-sm font-medium text-gray-600 mb-1">Fecha</label>
                   <input type="date" formControlName="fecha" class="w-full p-2.5 rounded-lg border border-gray-200 focus:border-brand-terra focus:ring-1 focus:ring-brand-terra outline-none transition-all">
                </div>
                
                <div *ngIf="type === 'VENTA'">
                   <div class="flex items-center justify-between mb-1">
                      <label class="block text-sm font-medium text-gray-600">Cliente</label>
                      <button type="button" (click)="goToClientManagement()" class="text-xs text-brand-terra hover:text-brand-wood font-medium flex items-center gap-1 transition-colors">
                         <lucide-icon name="users" [size]="14"></lucide-icon> Gestionar Clientes
                      </button>
                   </div>
                   <select formControlName="id_cliente" class="w-full p-2.5 rounded-lg border border-gray-200 focus:border-brand-terra outline-none">
                      <option [ngValue]="null" disabled>Seleccione Cliente</option>
                      <option *ngFor="let client of clients$ | async" [ngValue]="client.idClient">
                         {{ client.nameOfClient }}
                      </option>
                   </select>
                </div>
                
                <div *ngIf="type === 'COMPRA'">
                   <label class="block text-sm font-medium text-gray-600 mb-1">Proveedor</label>
                   <select formControlName="id_proveedor" class="w-full p-2.5 rounded-lg border border-gray-200 focus:border-brand-terra outline-none">
                      <option [ngValue]="null" disabled>Seleccione Proveedor</option>
                      <option *ngFor="let provider of providers$ | async" [ngValue]="provider.idProvider">
                         {{ provider.nameProvider }}
                      </option>
                   </select>
                </div>
                
                <div>
                   <label class="block text-sm font-medium text-gray-600 mb-1">Usuario</label>
                   <select formControlName="id_usuario" class="w-full p-2.5 rounded-lg border border-gray-200 focus:border-brand-terra outline-none">
                      <option [ngValue]="null" disabled>Seleccione Usuario</option>
                      <option *ngFor="let user of users$ | async" [ngValue]="user.idUser">
                         {{ user.name }} {{ user.role?.nameOfRole ? '(' + user.role.nameOfRole + ')' : '' }}
                      </option>
                   </select>
                </div>
             </div>
          </div>

          <!-- Details Section -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5">
             <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                <h3 class="font-bold text-brand-wood text-lg">Detalle de {{ type === 'VENTA' ? 'Platos' : 'Insumos' }}</h3>
                <button type="button" (click)="addDetail()" class="text-brand-terra font-medium hover:text-brand-wood flex items-center gap-1 text-sm bg-brand-terra/10 px-3 py-1 rounded-lg">
                   <lucide-icon name="plus" [size]="16"></lucide-icon> Agregar Fila
                </button>
             </div>

             <div formArrayName="detalles" class="space-y-4">
                <div *ngFor="let detail of detalles.controls; let i=index" [formGroupName]="i" class="flex items-end gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-brand-terra/30 transition-colors">
                   
                   <div class="flex-1">
                      <label class="block text-xs font-medium text-gray-500 mb-1">
                        {{ type === 'VENTA' ? 'Plato' : 'Insumo' }}
                      </label>
                      
                      <!-- Plato Select -->
                      <select *ngIf="type === 'VENTA'" formControlName="id_plato" class="w-full p-2 rounded-lg border border-gray-200" (change)="onDishChange(i)">
                         <option [ngValue]="null" disabled>Seleccione Plato</option>
                         <option *ngFor="let dish of platos$ | async" [ngValue]="dish.id_plato">
                             {{ dish.nombre }}
                         </option>
                      </select>

                       <!-- Insumo Select -->
                      <select *ngIf="type === 'COMPRA'" formControlName="id_insumo" class="w-full p-2 rounded-lg border border-gray-200">
                         <option [ngValue]="null" disabled>Seleccione Insumo</option>
                         <option *ngFor="let insumo of insumos$ | async" [ngValue]="insumo.id_insumo">
                             {{ insumo.nombre }}
                         </option>
                      </select>
                   </div>

                   <div class="w-32">
                      <label class="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
                      <input type="number" formControlName="cantidad" class="w-full p-2 rounded-lg border border-gray-200">
                   </div>

                   <div class="w-32">
                      <label class="block text-xs font-medium text-gray-500 mb-1">Precio Unit.</label>
                      <input type="number" formControlName="precio_unitario" class="w-full p-2 rounded-lg border border-gray-200">
                   </div>

                   <div class="pb-2">
                      <button type="button" (click)="removeDetail(i)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                         <lucide-icon name="trash-2" [size]="18"></lucide-icon>
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <!-- Footer Totals -->
          <div class="flex justify-end">
             <div class="bg-brand-dark text-white p-6 rounded-2xl w-full md:w-80 shadow-lg">
                <div class="flex justify-between mb-2 opacity-80">
                   <span>Subtotal</span>
                   <span>S/ {{ calculateSubtotal() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between mb-4 opacity-80">
                   <span>Impuesto (18%)</span>
                   <span>S/ {{ calculateTax() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-2xl font-bold pt-4 border-t border-white/20">
                   <span>Total</span>
                   <span>S/ {{ calculateTotal() | number:'1.2-2' }}</span>
                </div>
                
                <button type="submit" [disabled]="form.invalid" class="w-full mt-6 bg-brand-terra hover:bg-white hover:text-brand-terra text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                   <lucide-icon name="save" [size]="20"></lucide-icon>
                   {{ isSubmitting ? 'Guardando...' : 'Guardar Operación' }}
                </button>
             </div>
          </div>

       </form>

       <!-- Success Modal -->
       <div *ngIf="showSuccessModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 99999; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; margin: 0;">
          <div class="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
             <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <lucide-icon name="check-circle-2" [size]="32"></lucide-icon>
             </div>
             <h3 class="text-xl font-bold text-brand-dark mb-2">¡Operación Exitosa!</h3>
             <p class="text-gray-500 mb-6">La {{ type === 'VENTA' ? 'venta' : 'compra' }} se ha registrado correctamente en el sistema.</p>
             <button (click)="showSuccessModal = false" class="w-full bg-brand-dark text-white font-bold py-3 rounded-xl hover:bg-brand-wood transition-colors">
                Aceptar
             </button>
          </div>
       </div>

       <!-- Error Modal -->
       <div *ngIf="showErrorModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 99999; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; margin: 0;">
          <div class="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
             <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <lucide-icon name="alert-circle" [size]="32"></lucide-icon>
             </div>
             <h3 class="text-xl font-bold text-brand-dark mb-2">Error</h3>
             <p class="text-gray-500 mb-6">{{ errorMessage }}</p>
             <button (click)="showErrorModal = false" class="w-full bg-brand-dark text-white font-bold py-3 rounded-xl hover:bg-brand-wood transition-colors">
                Cerrar
             </button>
          </div>
       </div>

    </div>
  `
})
export class GenericTransactionComponent implements OnInit {
   salesService = inject(SalesService);
   purchaseService = inject(PurchaseService);
   inventoryService = inject(InventoryService);
   fb = inject(FormBuilder);
   route = inject(ActivatedRoute);
   router = inject(Router);
   // cdr removed - no longer needed

   title = 'Registro';
   type: 'VENTA' | 'COMPRA' = 'VENTA';
   currentDate = new Date().toISOString().substring(0, 10);
   isSubmitting = false;
   showSuccessModal = false;
   showErrorModal = false;
   errorMessage = '';

   // Observables for Dropdowns
   clients$: Observable<any[]> = of([]);
   providers$: Observable<any[]> = of([]);
   users$: Observable<any[]> = of([]);
   platos$: Observable<any[]> = this.inventoryService.getPlatos();
   insumos$: Observable<any[]> = this.inventoryService.getInsumos();

   // Need to keep reference to dishes to auto-set price
   dishesList: any[] = [];

   form = this.fb.group({
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      id_cliente: [null as number | null, Validators.required],
      id_proveedor: [null as number | null],
      id_usuario: [null as number | null, Validators.required],
      detalles: this.fb.array([])
   });

   get detalles() {
      return this.form.get('detalles') as FormArray;
   }

   ngOnInit() {
      this.route.data.subscribe(data => {
         this.title = data['title'] || 'Registro';
         this.type = data['type'] || 'VENTA';
         // Defer execution to avoid NG0100 (ExpressionChangedAfterItHasBeenCheckedError)
         setTimeout(() => {
            this.setupObservables();
         }, 0);
      });

      this.inventoryService.getPlatos().subscribe(d => this.dishesList = d);
   }

   setupObservables() {
      if (this.type === 'VENTA') {
         this.clients$ = this.salesService.getClients();
         this.users$ = this.salesService.getUsers();
         this.form.get('id_cliente')?.setValidators(Validators.required);
         this.form.get('id_proveedor')?.clearValidators();
      } else {
         this.providers$ = this.purchaseService.getProviders();
         this.users$ = this.purchaseService.getUsers();
         this.form.get('id_proveedor')?.setValidators(Validators.required);
         this.form.get('id_cliente')?.clearValidators();
      }
      this.form.get('id_cliente')?.updateValueAndValidity();
      this.form.get('id_proveedor')?.updateValueAndValidity();
   }

   goToClientManagement() {
      this.router.navigate(['/ventas/clientes']);
   }

   addDetail() {
      const group = this.fb.group({
         cantidad: [1, [Validators.required, Validators.min(0.01)]],
         precio_unitario: [0, [Validators.required, Validators.min(0)]],
         id_plato: [null],
         id_insumo: [null]
      });

      if (this.type === 'VENTA') {
         group.get('id_plato')?.setValidators([Validators.required]);
      } else {
         group.get('id_insumo')?.setValidators([Validators.required]);
      }

      this.detalles.push(group);
   }

   removeDetail(index: number) {
      this.detalles.removeAt(index);
   }

   onDishChange(index: number) {
      // Auto-set price for dishes
      const detail = this.detalles.at(index);
      const dishId = detail.get('id_plato')?.value;
      // Depending on how dishId is captured (string vs number), might need strict equality check adjustment
      const dish = this.dishesList.find(d => d.id_plato == dishId);

      if (dish && dish.priceDish !== undefined) {
         detail.patchValue({ precio_unitario: dish.priceDish });
      }
   }

   calculateSubtotal(): number {
      return this.detalles.controls.reduce((acc, control) => {
         const qty = control.get('cantidad')?.value || 0;
         const price = control.get('precio_unitario')?.value || 0;
         return acc + (qty * price);
      }, 0);
   }

   calculateTax(): number {
      return this.calculateSubtotal() * 0.18;
   }

   calculateTotal(): number {
      return this.calculateSubtotal() * 1.18;
   }

   onSubmit() {
      if (this.form.invalid || this.isSubmitting) return;

      this.isSubmitting = true;
      const formVal = this.form.value;
      console.log('Form Value:', formVal);

      if (this.type === 'VENTA') {
         const sale: SaleDTO = {
            idClient: Number(formVal.id_cliente),
            idUser: Number(formVal.id_usuario),
            details: (formVal.detalles as any[]).map(d => ({
               idDish: Number(d.id_plato),
               quantity: Number(d.cantidad)
            }))
         };

         console.log('Sending Sale Payload:', JSON.stringify(sale));

         this.salesService.saveSale(sale).subscribe({
            next: () => {
               this.isSubmitting = false;
               this.showSuccessModal = true;
               this.resetForm();
            },
            error: (err) => {
               this.isSubmitting = false;
               console.error('Sale Error:', err);
               if (err.error && err.error.message && err.error.message.includes('unique result')) {
                  this.errorMessage = 'Error del sistema: Se encontraron múltiples registros para el cliente o usuario seleccionado.';
               } else {
                  this.errorMessage = 'Ocurrió un error al registrar la venta. Verifique los datos e intente nuevamente.';
               }
               this.showErrorModal = true;
            }
         });

      } else {
         // COMPRA
         const buy: BuyDTO = {
            idProvider: Number(formVal.id_proveedor),
            idUser: Number(formVal.id_usuario),
            dateTime: new Date().toISOString(),
            details: (formVal.detalles as any[]).map(d => ({
               idSupply: Number(d.id_insumo),
               quantity: Number(d.cantidad),
               unitPrice: Number(d.precio_unitario)
            }))
         };

         console.log('Sending Purchase Payload:', JSON.stringify(buy));

         this.purchaseService.savePurchase(buy).subscribe({
            next: () => {
               this.isSubmitting = false;
               this.showSuccessModal = true;
               this.resetForm();
            },
            error: (err) => {
               this.isSubmitting = false;
               console.error('Purchase Error:', err);
               this.errorMessage = 'Ocurrió un error al registrar la compra.';
               this.showErrorModal = true;
            }
         });
      }
   }

   resetForm() {
      this.form.reset({
         fecha: new Date().toISOString().substring(0, 10),
         id_usuario: null,
         // id_cliente and id_proveedor are nullable, details empty
      });
      this.detalles.clear();
   }
}
