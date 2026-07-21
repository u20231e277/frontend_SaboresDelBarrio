import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';
import { SalesService } from '../../../services/sales.service';
import { AuthService } from '../../../services/auth.service';
import { ClientDTO, DishDTO, SaleDTO, WasteDTO } from '../../../models/api-dtos.model';

interface DishSummary {
  idDish: number;
  nameDish: string;
  quantity: number;
  amount: number;
}

interface WasteDailySummary {
  date: string;
  records: number;
  totalQuantity: number;
  reasons: string;
}

interface ClientFrequencySummary {
  idClient: number;
  nameOfClient: string;
  salesCount: number;
  totalAmount: number;
  lastSale: string;
}

@Component({
  selector: 'app-sprint2-consultas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.25em] text-brand-terra">Sprint 2</p>
          <h2 class="text-3xl font-bold text-brand-dark">Consultas históricas</h2>
          <p class="text-gray-500 mt-2 max-w-3xl">
            Prototipos funcionales para HUS10, HUS11 y HUS12 usando información real de ventas, clientes y mermas.
          </p>
        </div>
        <button type="button" (click)="loadReports()"
          class="bg-brand-terra hover:bg-brand-wood text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
          <lucide-icon name="activity" [size]="18"></lucide-icon>
          Actualizar consultas
        </button>
      </div>

      <form [formGroup]="filterForm" (ngSubmit)="loadReports()"
        class="bg-white rounded-2xl p-5 shadow-sm border border-brand-wood/5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Fecha inicial</label>
          <input type="date" formControlName="startDate"
            class="w-full p-2.5 rounded-lg border border-gray-200 focus:border-brand-terra focus:ring-1 focus:ring-brand-terra outline-none">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Fecha final</label>
          <input type="date" formControlName="endDate"
            class="w-full p-2.5 rounded-lg border border-gray-200 focus:border-brand-terra focus:ring-1 focus:ring-brand-terra outline-none">
        </div>
        <div class="flex items-end">
          <button type="submit"
            class="w-full bg-brand-dark hover:bg-brand-wood text-white font-bold py-2.5 rounded-xl transition-colors">
            Aplicar rango
          </button>
        </div>
      </form>

      <div *ngIf="isLoading" class="bg-white rounded-2xl p-8 text-center text-brand-wood shadow-sm">
        <lucide-icon name="loader-2" [size]="28" class="animate-spin mx-auto mb-3"></lucide-icon>
        Consultando datos del backend...
      </div>

      <div *ngIf="errorMessage" class="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4">
        {{ errorMessage }}
      </div>

      <section id="hus10-platos" class="bg-white rounded-2xl shadow-sm border border-brand-wood/5 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-bold text-brand-terra uppercase tracking-widest">HUS10</p>
            <h3 class="text-xl font-bold text-brand-dark mt-1">Consulta de platos más vendidos</h3>
            <p class="text-sm text-gray-500 mt-1">Ranking por cantidad y monto vendido en el rango seleccionado.</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-black text-brand-dark">{{ totalDishesQuantity }}</p>
            <p class="text-xs text-gray-500">unidades vendidas</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="text-xs text-brand-wood uppercase bg-brand-cream/40">
              <tr>
                <th class="px-6 py-4">#</th>
                <th class="px-6 py-4">Plato</th>
                <th class="px-6 py-4 text-right">Cantidad</th>
                <th class="px-6 py-4 text-right">Monto estimado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let dish of topDishes; let i = index" class="border-b border-gray-50 hover:bg-brand-cream/20">
                <td class="px-6 py-4 font-bold text-brand-terra">{{ i + 1 }}</td>
                <td class="px-6 py-4 font-medium text-brand-dark">{{ dish.nameDish }}</td>
                <td class="px-6 py-4 text-right">{{ dish.quantity }}</td>
                <td class="px-6 py-4 text-right">S/ {{ dish.amount | number:'1.2-2' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="hus11-mermas" class="bg-white rounded-2xl shadow-sm border border-brand-wood/5 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-bold text-brand-terra uppercase tracking-widest">HUS11</p>
            <h3 class="text-xl font-bold text-brand-dark mt-1">Reporte de mermas y sobrantes diarios</h3>
            <p class="text-sm text-gray-500 mt-1">Agrupación diaria de registros de merma por fecha y motivo.</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-black text-brand-dark">{{ totalWasteQuantity | number:'1.2-2' }}</p>
            <p class="text-xs text-gray-500">cantidad total</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="text-xs text-brand-wood uppercase bg-brand-cream/40">
              <tr>
                <th class="px-6 py-4">Fecha</th>
                <th class="px-6 py-4 text-right">Registros</th>
                <th class="px-6 py-4 text-right">Cantidad total</th>
                <th class="px-6 py-4">Motivos</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let waste of wasteByDay" class="border-b border-gray-50 hover:bg-brand-cream/20">
                <td class="px-6 py-4 font-medium text-brand-dark">{{ waste.date }}</td>
                <td class="px-6 py-4 text-right">{{ waste.records }}</td>
                <td class="px-6 py-4 text-right">{{ waste.totalQuantity | number:'1.2-2' }}</td>
                <td class="px-6 py-4 text-gray-500">{{ waste.reasons }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section *ngIf="canViewClientFrequency" id="hus12-clientes" class="bg-white rounded-2xl shadow-sm border border-brand-wood/5 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-bold text-brand-terra uppercase tracking-widest">HUS12</p>
            <h3 class="text-xl font-bold text-brand-dark mt-1">Consulta de clientes frecuentes</h3>
            <p class="text-sm text-gray-500 mt-1">Recurrencia de clientes calculada desde ventas asociadas.</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-black text-brand-dark">{{ frequentClients.length }}</p>
            <p class="text-xs text-gray-500">clientes evaluados</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="text-xs text-brand-wood uppercase bg-brand-cream/40">
              <tr>
                <th class="px-6 py-4">Cliente</th>
                <th class="px-6 py-4 text-right">Ventas</th>
                <th class="px-6 py-4 text-right">Total vendido</th>
                <th class="px-6 py-4">Última venta</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let client of frequentClients" class="border-b border-gray-50 hover:bg-brand-cream/20">
                <td class="px-6 py-4 font-medium text-brand-dark">{{ client.nameOfClient }}</td>
                <td class="px-6 py-4 text-right">{{ client.salesCount }}</td>
                <td class="px-6 py-4 text-right">S/ {{ client.totalAmount | number:'1.2-2' }}</td>
                <td class="px-6 py-4 text-gray-500">{{ client.lastSale || 'Sin ventas' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `
})
export class Sprint2ConsultasComponent implements OnInit {
  private salesService = inject(SalesService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  isLoading = false;
  errorMessage = '';
  topDishes: DishSummary[] = [];
  wasteByDay: WasteDailySummary[] = [];
  frequentClients: ClientFrequencySummary[] = [];

  filterForm = this.fb.group({
    startDate: ['2025-01-01'],
    endDate: ['2026-12-31']
  });

  get totalDishesQuantity(): number {
    return this.topDishes.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalWasteQuantity(): number {
    return this.wasteByDay.reduce((sum, item) => sum + item.totalQuantity, 0);
  }

  get canViewClientFrequency(): boolean {
    return this.authService.hasRole('ADMINISTRADOR');
  }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const { start, end } = this.getDateRange();

    forkJoin({
      dishes: this.loadDishSummary(start, end),
      wastes: this.salesService.getWastes().pipe(catchError(() => of([] as WasteDTO[]))),
      clients: this.canViewClientFrequency
        ? this.salesService.getClients().pipe(catchError(() => of([] as ClientDTO[])))
        : of([] as ClientDTO[]),
      sales: this.canViewClientFrequency
        ? this.salesService.getSalesBetween(start, end).pipe(catchError(() => of([] as SaleDTO[])))
        : of([] as SaleDTO[])
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: ({ dishes, wastes, clients, sales }) => {
        this.topDishes = dishes;
        this.wasteByDay = this.buildWasteSummary(wastes);
        this.frequentClients = this.buildClientFrequency(clients, sales);
      },
      error: (error) => {
        console.error('Error loading Sprint 2 reports', error);
        this.errorMessage = 'No se pudieron cargar las consultas del Sprint 2. Verifique backend, token y base de datos.';
      }
    });
  }

  private getDateRange(): { start: string; end: string } {
    const rawStart = this.filterForm.value.startDate || '2025-01-01';
    const rawEnd = this.filterForm.value.endDate || '2026-12-31';
    return {
      start: `${rawStart}T00:00:00`,
      end: `${rawEnd}T23:59:59`
    };
  }

  private loadDishSummary(start: string, end: string) {
    return this.salesService.getDishes().pipe(
      switchMap((dishes: DishDTO[]) => {
        const requests = dishes
          .filter(dish => !!dish.idDish)
          .map(dish => forkJoin({
            quantity: this.salesService.getDishQuantityBetween(dish.idDish!, start, end).pipe(catchError(() => of(0))),
            amount: this.salesService.getDishAmountBetween(dish.idDish!, start, end).pipe(catchError(() => of(0)))
          }).pipe(
            map(({ quantity, amount }) => ({
              idDish: dish.idDish!,
              nameDish: dish.nameDish,
              quantity: Number(quantity || 0),
              amount: Number(amount || 0)
            }))
          ));

        return requests.length ? forkJoin(requests) : of([] as DishSummary[]);
      }),
      map((rows: DishSummary[]) => rows
        .filter(row => row.quantity > 0)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10)
      ),
      catchError(() => of([] as DishSummary[]))
    );
  }

  private buildWasteSummary(wastes: WasteDTO[]): WasteDailySummary[] {
    const { start, end } = this.getDateRange();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const grouped = new Map<string, { records: number; totalQuantity: number; reasons: Set<string> }>();

    wastes.forEach(waste => {
      const wasteTime = new Date(waste.dateWaste).getTime();
      if (Number.isNaN(wasteTime) || wasteTime < startTime || wasteTime > endTime) return;
      const date = waste.dateWaste.substring(0, 10);
      const current = grouped.get(date) || { records: 0, totalQuantity: 0, reasons: new Set<string>() };
      current.records += 1;
      current.totalQuantity += Number(waste.quantityWaste || 0);
      if (waste.reasonWaste) current.reasons.add(waste.reasonWaste);
      grouped.set(date, current);
    });

    return Array.from(grouped.entries())
      .map(([date, data]) => ({
        date,
        records: data.records,
        totalQuantity: data.totalQuantity,
        reasons: Array.from(data.reasons).slice(0, 3).join(', ') || 'Sin motivo'
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10);
  }

  private buildClientFrequency(clients: ClientDTO[], sales: SaleDTO[]): ClientFrequencySummary[] {
    const clientNames = new Map<number, string>();
    clients.forEach(client => {
      if (client.idClient) clientNames.set(client.idClient, client.nameOfClient);
    });

    const grouped = new Map<number, { salesCount: number; totalAmount: number; lastSale: string }>();
    sales.forEach(sale => {
      if (!sale.idClient) return;
      const current = grouped.get(sale.idClient) || { salesCount: 0, totalAmount: 0, lastSale: '' };
      current.salesCount += 1;
      current.totalAmount += Number(sale.total || 0);
      const date = sale.dateTime ? sale.dateTime.substring(0, 10) : '';
      if (date && date > current.lastSale) current.lastSale = date;
      grouped.set(sale.idClient, current);
    });

    return Array.from(grouped.entries())
      .map(([idClient, data]) => ({
        idClient,
        nameOfClient: clientNames.get(idClient) || `Cliente ${idClient}`,
        ...data
      }))
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 10);
  }
}
