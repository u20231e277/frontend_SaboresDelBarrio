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
                <p class="text-sm text-gray-500">Configuración de análisis predictivo</p>
             </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
             <div class="lg:col-span-1 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Insumo a Predecir</label>
                    <select [(ngModel)]="selectedInsumo" class="w-full p-3 rounded-xl border border-gray-200 focus:border-brand-terra outline-none bg-gray-50">
                       <option [ngValue]="null" disabled>Seleccione Insumo</option>
                       <option *ngFor="let item of insumos$ | async" [value]="item.id_insumo">{{ item.nombre }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Intervalo de Tiempo</label>
                    <select [(ngModel)]="selectedInterval" class="w-full p-3 rounded-xl border border-gray-200 focus:border-brand-terra outline-none bg-gray-50">
                       <option *ngFor="let m of timeIntervals" [value]="m.value">{{ m.label }}</option>
                    </select>
                </div>
                
                 <!-- Buttons -->
                 <button (click)="runPrediction()" class="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-brand-terra text-white rounded-xl hover:bg-brand-terra/90 transition-colors shadow-lg font-bold">
                    <lucide-icon name="brain-circuit" [size]="20"></lucide-icon>
                    PREDECIR
                 </button>
                 <button *ngIf="currentPrediction" (click)="downloadReport()" class="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 bg-brand-dark text-white rounded-xl hover:bg-brand-wood transition-colors shadow-lg">
                    <lucide-icon name="file-text" [size]="20"></lucide-icon>
                    Descargar Reporte PDF
                 </button>
             </div>
             
             <div class="lg:col-span-3">
                 <!-- Prediction Result Card -->
                 <div *ngIf="currentPrediction" class="bg-white border border-brand-wood/10 rounded-xl p-6 shadow-sm h-full flex flex-col justify-center min-h-[250px]">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-3 bg-green-50 text-green-600 rounded-xl">
                            <lucide-icon name="check-circle" [size]="28"></lucide-icon>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-brand-dark">Resumen de la Predicción</h4>
                            <p class="text-sm text-gray-500">Resultados generados exitosamente</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p class="text-sm text-gray-500 mb-1">Insumo ID Analizado</p>
                            <p class="text-lg font-bold text-brand-dark">#{{ currentPrediction.insumoId || '---' }}</p>
                        </div>
                        <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p class="text-sm text-gray-500 mb-1">Intervalo Seleccionado</p>
                            <p class="text-lg font-bold text-brand-dark">{{ getIntervalLabel(currentPrediction.intervalo) }}</p>
                        </div>
                        <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p class="text-sm text-gray-500 mb-1">Demanda Estimada</p>
                            <div class="flex items-baseline gap-2">
                               <span class="text-2xl font-bold text-brand-dark">{{ currentPrediction.cantidad_estimada }}</span>
                               <span class="text-sm text-gray-500 font-medium">{{ getUnit() }}</span>
                            </div>
                        </div>
                        <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p class="text-sm text-gray-500 mb-1">Nivel de Confianza</p>
                            <p class="text-lg font-bold text-green-600">{{ currentPrediction.confianza }}%</p>
                        </div>
                    </div>
                 </div>

                 <!-- Empty State -->
                 <div *ngIf="!currentPrediction" class="h-full flex items-center justify-center text-gray-400 text-sm italic min-h-[250px] border-2 border-dashed border-gray-100 rounded-xl">
                    <div class="text-center">
                        <lucide-icon name="brain-circuit" [size]="48" class="mx-auto mb-2 opacity-20"></lucide-icon>
                        <p>Configure los parámetros y presione "PREDECIR" para generar un análisis.</p>
                    </div>
                 </div>
             </div>
          </div>
       </div>

      <!-- Charts Section (Global) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
         <!-- 1. Gráfico de Barras de Recomendación de Reabastecimiento -->
         <div class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5 h-80 flex flex-col">
            <h3 class="font-bold text-brand-dark mb-4">Recomendación de Reabastecimiento</h3>
            <div class="flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 relative overflow-hidden group">
               <div class="text-center z-10 transition-transform group-hover:scale-105">
                  <lucide-icon name="bar-chart-3" [size]="48" class="mx-auto mb-2 opacity-30 text-blue-500"></lucide-icon>
                  <p class="font-medium text-gray-600">Gráfico de Barras</p>
                  <p class="text-xs mt-1 text-gray-400">Stock actual vs Cantidad a pedir</p>
               </div>
            </div>
         </div>

         <!-- 2. Gráfico de Líneas de Tendencia (Demanda Predicha vs. Histórica) -->
         <div class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5 h-80 flex flex-col">
            <div class="w-full flex justify-between items-center mb-4">
                <h3 class="font-bold text-brand-dark">Líneas de Tendencia</h3>
                <span class="text-[10px] uppercase font-bold text-brand-terra bg-brand-terra/10 px-2 py-1 rounded">Predicha vs Histórica</span>
            </div>
            <div class="flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 relative overflow-hidden group">
               <div class="text-center z-10 transition-transform group-hover:scale-105">
                  <lucide-icon name="trending-up" [size]="48" class="mx-auto mb-2 opacity-30 text-brand-terra"></lucide-icon>
                  <p class="font-medium text-gray-600">Gráfico de Líneas</p>
                  <p class="text-xs mt-1 text-gray-400">Proyección con intervalo de confianza</p>
               </div>
            </div>
         </div>

         <!-- 3. Composición del Costo Total de Insumos (Food Cost) -->
         <div class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5 h-80 flex flex-col">
            <h3 class="font-bold text-brand-dark mb-4">Costos por Insumo (Food Cost)</h3>
            <div class="flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 relative overflow-hidden group">
               <div class="text-center z-10 transition-transform group-hover:scale-105">
                  <lucide-icon name="pie-chart" [size]="48" class="mx-auto mb-2 opacity-30 text-green-500"></lucide-icon>
                  <p class="font-medium text-gray-600">Gráfico Circular</p>
                  <p class="text-xs mt-1 text-gray-400">Gasto real vs Gasto predicho</p>
               </div>
            </div>
         </div>

         <!-- 4. Mapa de Calor (Heatmap) de Demanda Temporal -->
         <div class="bg-white p-6 rounded-2xl shadow-sm border border-brand-wood/5 h-80 flex flex-col">
            <h3 class="font-bold text-brand-dark mb-4">Mapa de Calor: Demanda Temporal</h3>
            <div class="flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 relative overflow-hidden group">
               <div class="text-center z-10 transition-transform group-hover:scale-105">
                  <lucide-icon name="layout-dashboard" [size]="48" class="mx-auto mb-2 opacity-30 text-orange-500"></lucide-icon>
                  <p class="font-medium text-gray-600">Mapa de Calor (Heatmap)</p>
                  <p class="text-xs mt-1 text-gray-400">Volumen por días y horas</p>
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
   selectedInterval: string = '1_semana';
   currentPrediction: any = null;

   timeIntervals = [
      { value: '3_dias', label: '3 Días' },
      { value: '1_semana', label: '1 Semana' },
      { value: '1_mes', label: '1 Mes' }
   ];

   ngOnInit() {
      this.dashboardService.getKPIs().subscribe(data => this.kpis = data);
   }

   runPrediction() {
      if (!this.selectedInsumo) {
         alert('Por favor, selecciona un insumo primero.');
         return;
      }
      
      // Construimos el payload que será enviado al API cuando esté lista
      const payloadRequest = {
         producto_id: this.selectedInsumo,
         intervalo_tiempo: this.selectedInterval
      };
      console.log('Enviando datos al motor de predicción (simulado):', payloadRequest);

      setTimeout(() => {
         // Desplegamos el estado del resumen simulado
         this.currentPrediction = {
            insumoId: this.selectedInsumo,
            intervalo: this.selectedInterval,
            cantidad_estimada: Math.floor(Math.random() * 50) + 20,
            confianza: Math.floor(Math.random() * 10) + 85 // Rango 85-94%
         };
      }, 500);
   }

   getIntervalLabel(val: string): string {
      const found = this.timeIntervals.find(i => i.value === val);
      return found ? found.label : val;
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
