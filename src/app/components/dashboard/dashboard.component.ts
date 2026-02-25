import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { InventoryService } from '../../services/inventory.service';
import { LucideAngularModule } from 'lucide-angular';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [CommonModule, FormsModule, LucideAngularModule],
   template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
           <h2 class="text-2xl font-bold text-brand-dark">Dashboard</h2>
           <p class="text-gray-500">Resumen y predicciones del día</p>
        </div>
        <div class="text-right">
           <div class="text-sm font-medium text-brand-wood-light">{{ today | date:'fullDate' }}</div>
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Efficiency Card -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5 flex items-start justify-between">
           <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Eficiencia Cocina</p>
              <h3 class="text-3xl font-bold text-brand-dark">{{ kpis?.eficiencia }}%</h3>
              <div class="flex items-center gap-1 text-green-600 text-sm mt-2">
                 <lucide-icon name="trending-up" [size]="16"></lucide-icon>
                 <span>+2.4% vs ayer</span>
              </div>
           </div>
           <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <lucide-icon name="activity" [size]="24"></lucide-icon>
           </div>
        </div>

        <!-- Mermas Card -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5 flex items-start justify-between">
           <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Mermas (Kg)</p>
              <h3 class="text-3xl font-bold text-brand-dark">{{ kpis?.mermas }}</h3>
              <div class="flex items-center gap-1 text-red-500 text-sm mt-2">
                 <lucide-icon name="trending-down" [size]="16"></lucide-icon>
                 <span>-0.5% vs obj</span>
              </div>
           </div>
           <div class="p-3 bg-red-50 text-brand-terra rounded-xl">
              <lucide-icon name="trending-down" [size]="24"></lucide-icon>
           </div>
        </div>

        <!-- Ventas Card (Proyectadas) -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5 flex items-start justify-between">
           <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Ventas Proyectadas</p>
              <h3 class="text-3xl font-bold text-brand-dark">S/ {{ kpis?.ventas_proyectadas }}</h3>
              <div class="flex items-center gap-1 text-brand-terra text-sm mt-2 font-medium">
                 <span>Predicción IA</span>
              </div>
           </div>
           <div class="p-3 bg-brand-cream text-brand-wood rounded-xl">
              <lucide-icon name="dollar-sign" [size]="24"></lucide-icon>
           </div>
        </div>
      </div>

       <!-- Prediction Section -->
       <div class="bg-white p-8 rounded-2xl shadow-sm border border-brand-wood/5">
          <div class="flex items-center gap-3 mb-6">
             <div class="p-2 bg-brand-terra/10 text-brand-terra rounded-lg">
                <lucide-icon name="brain-circuit" [size]="24"></lucide-icon> 
             </div>
             <div>
                <h3 class="text-xl font-bold text-brand-dark">Motor de Predicción (Random Forest)</h3>
                <p class="text-sm text-gray-500">Estima stock necesario por insumo y mes</p>
             </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
             <div class="lg:col-span-1 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Insumo a Predecir</label>
                    <select [(ngModel)]="selectedInsumo" (change)="checkPrediction()" class="w-full p-3 rounded-xl border border-gray-200 focus:border-brand-terra outline-none bg-gray-50">
                       <option [ngValue]="null" disabled>Seleccione Insumo</option>
                       <option *ngFor="let item of insumos$ | async" [value]="item.id_insumo">{{ item.nombre }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Mes de Proyección</label>
                    <select [(ngModel)]="selectedMonth" (change)="checkPrediction()" class="w-full p-3 rounded-xl border border-gray-200 focus:border-brand-terra outline-none bg-gray-50">
                       <option *ngFor="let m of months" [value]="m.value">{{ m.label }}</option>
                    </select>
                </div>
                
                 <!-- Download Report Button -->
                 <button *ngIf="currentPrediction" (click)="downloadReport()" class="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-brand-dark text-white rounded-xl hover:bg-brand-wood transition-colors shadow-lg">
                    <lucide-icon name="file-text" [size]="20"></lucide-icon>
                    Descargar Reporte PDF
                 </button>
             </div>
             
             <div class="lg:col-span-3">
                 <!-- Prediction Result Card -->
                 <div *ngIf="currentPrediction" class="bg-white border border-brand-wood/10 rounded-xl p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                           <div class="flex items-center gap-2 mb-1">
                              <span class="text-xs font-bold uppercase tracking-wider text-brand-wood bg-brand-cream px-2 py-1 rounded-md" *ngIf="currentPrediction.antiguo">
                                 Predicción Antigua ({{ currentPrediction.fecha_prediccion }})
                              </span>
                               <span class="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-1 rounded-md" *ngIf="!currentPrediction.antiguo">
                                 Nueva Predicción
                              </span>
                           </div>
                           <div class="flex items-baseline gap-2 mt-2">
                              <span class="text-4xl font-bold text-brand-dark">{{ currentPrediction.cantidad_estimada }}</span>
                              <span class="text-xl text-gray-500 font-medium">{{ getUnit() }} estimados</span>
                           </div>
                        </div>
                        
                        <button (click)="runInfoPrediction()" class="px-4 py-2 border-2 border-brand-terra text-brand-terra hover:bg-brand-terra hover:text-white rounded-lg font-bold transition-colors text-sm">
                           {{ currentPrediction.antiguo ? 'Recalcular Ahora' : 'Actualizar Datos' }}
                        </button>
                    </div>
                    
                    <!-- Chart Visualization (CSS Bars) -->
                    <div class="mt-8">
                        <h4 class="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Histórico vs Predicción</h4>
                        <div class="flex items-end gap-2 h-48 w-full">
                            <div *ngFor="let stat of predictionStats" class="flex-1 flex flex-col items-center group relative">
                                <!-- Tooltip -->
                                <div class="absolute -top-10 bg-brand-dark text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Real: {{ stat.real }} | Pred: {{ stat.prediccion }}
                                </div>
                                
                                <!-- Bar Container -->
                                <div class="w-full max-w-[40px] flex gap-1 items-end h-full">
                                    <!-- Real Bar -->
                                    <div class="w-1/2 bg-gray-300 rounded-t-sm transition-all hover:bg-gray-400" 
                                         [style.height.%]="(stat.real / maxVal) * 100"></div>
                                    <!-- Pred Bar -->
                                    <div class="w-1/2 bg-brand-terra rounded-t-sm transition-all hover:bg-brand-terra/80" 
                                         [style.height.%]="(stat.prediccion / maxVal) * 100"></div>
                                </div>
                                <span class="text-xs text-gray-500 mt-2 font-medium">{{ stat.mes }}</span>
                            </div>
                        </div>
                        <div class="flex justify-center gap-4 mt-4 text-xs">
                            <div class="flex items-center gap-1"><div class="w-3 h-3 bg-gray-300 rounded-sm"></div> Consumo Real</div>
                            <div class="flex items-center gap-1"><div class="w-3 h-3 bg-brand-terra rounded-sm"></div> Predicción</div>
                        </div>
                    </div>
                 </div>

                 <!-- Empty State -->
                 <div *ngIf="!currentPrediction && selectedInsumo" class="h-full flex items-center justify-center text-gray-400 text-sm italic min-h-[300px] border-2 border-dashed border-gray-100 rounded-xl">
                    <p>Seleccione insumo y mes para ver o generar predicción.</p>
                 </div>
                 
                  <div *ngIf="!selectedInsumo" class="h-full flex items-center justify-center text-gray-400 text-sm italic min-h-[300px] border-2 border-dashed border-gray-100 rounded-xl">
                    <div class="text-center">
                        <lucide-icon name="brain-circuit" [size]="48" class="mx-auto mb-2 opacity-20"></lucide-icon>
                        <p>Seleccione un insumo para comenzar el análisis.</p>
                    </div>
                 </div>
             </div>
          </div>
       </div>

      <!-- Charts Section (Global) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <!-- Demand Prediction Chart Placeholder -->
         <div class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5 h-80 flex flex-col">
            <h3 class="font-bold text-brand-dark mb-4">Tendencia de Demanda (Histórico vs Predicción)</h3>
            <div class="flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
               <div class="text-center">
                  <lucide-icon name="bar-chart-3" [size]="48" class="mx-auto mb-2 opacity-20"></lucide-icon>
                  <p>Gráfico de Barras / Lineal</p>
                  <p class="text-xs mt-1">Comparativa de consumo real vs predicho</p>
               </div>
            </div>
         </div>

         <!-- Input Demand Prediction Chart Placeholder -->
         <div class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5 h-80 flex flex-col">
            <h3 class="font-bold text-brand-dark mb-4">Proyección de Costos</h3>
            <div class="flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
               <div class="text-center">
                  <lucide-icon name="pie-chart" [size]="48" class="mx-auto mb-2 opacity-20"></lucide-icon>
                  <p>Gráfico Circular</p>
                  <p class="text-xs mt-1">Distribución de costos por categoría</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
   dashboardService = inject(DashboardService);
   inventoryService = inject(InventoryService);

   kpis: any;
   today = new Date();

   insumos$: Observable<any[]> = this.inventoryService.getInsumos();
   selectedInsumo: number | null = null;
   selectedMonth: number = new Date().getMonth() + 1;

   currentPrediction: any = null;
   predictionStats: any[] = [];
   maxVal = 100; // For chart scaling

   months = [
      { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
      { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
      { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
      { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' }
   ];

   ngOnInit() {
      this.dashboardService.getKPIs().subscribe(data => this.kpis = data);
   }

   checkPrediction() {
      if (this.selectedInsumo) {
         this.currentPrediction = null;
         this.dashboardService.checkPrediction(this.selectedInsumo, this.selectedMonth)
            .subscribe(pred => {
               if (pred) {
                  this.currentPrediction = pred;
                  this.loadStats();
               } else {
                  this.runInfoPrediction();
               }
            });
      }
   }

   runInfoPrediction() {
      if (this.selectedInsumo) {
         this.dashboardService.runPrediction(this.selectedInsumo, this.selectedMonth)
            .subscribe(res => {
               this.currentPrediction = res;
               this.loadStats();
            });
      }
   }

   loadStats() {
      if (this.selectedInsumo) {
         this.dashboardService.getPredictionStats(this.selectedInsumo).subscribe(stats => {
            this.predictionStats = stats;
            // Calc max value for scaling
            this.maxVal = Math.max(...stats.map(s => Math.max(s.real, s.prediccion))) * 1.2;
         });
      }
   }

   getUnit() {
      return 'Kg';
   }

   downloadReport() {
      alert('Descargando reporte PDF para ' + (this.currentPrediction?.fecha_prediccion || 'Predicción'));
      // Logic for PDF generation would go here (e.g. using jsPDF)
      console.log('Downloading PDF report...');
   }
}
