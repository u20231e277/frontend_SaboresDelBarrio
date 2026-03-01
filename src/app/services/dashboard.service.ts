import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { WasteDTO, SaleDTO } from '../models/api-dtos.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = environment.apiUrl;

    constructor() { }

    // Aggregate KPIs from multiple endpoints
    getKPIs(): Observable<any> {
        return forkJoin({
            wastes: this.getWastes(),
            salesTotal: this.getSalesTotalToday(),
            // Efficiency and projected sales kept as mock/calc for now or added later if API exists
        }).pipe(
            map(results => {
                // Calculate total quantity wasted
                const totalMermaQty = results.wastes.reduce((acc, curr) => acc + curr.quantityWaste, 0);

                return {
                    mermas: totalMermaQty,
                    eficiencia: 88, // Mock/Placeholder until logic defined
                    ventas_dia: results.salesTotal,
                    ventas_proyectadas: 1800 // Mock/Placeholder
                };
            })
        );
    }

    getWastes(): Observable<WasteDTO[]> {
        if (!this.authService.hasRole('JEFE_DE_COCINA') && !this.authService.hasRole('ADMINISTRADOR')) {
            return of([]);
        }

        return this.http.get<WasteDTO[]>(`${this.apiUrl}/wastes`).pipe(
            catchError(() => of([]))
        );
    }

    getSalesTotalToday(): Observable<number> {
        if (!this.authService.hasRole('MOZO') && !this.authService.hasRole('ADMINISTRADOR')) {
            return of(0);
        }

        // Determine today's start and end
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        return this.http.get<number>(`${this.apiUrl}/sales/total`, {
            params: {
                start: start.toISOString(),
                end: end.toISOString()
            }
        }).pipe(
            catchError(() => of(0))
        );
    }

    // Mock Prediction Logic
    checkPrediction(id_insumo: number, month: number): Observable<any | null> {
        // Simulates checking if a prediction exists
        console.log(`Checking prediction for insumo ${id_insumo} month ${month}`);

        // Mock: Returns existing prediction for Lomo Fino (id 1) in current month
        if (id_insumo === 1 && month === new Date().getMonth() + 1) {
            return of({
                fecha_prediccion: '2023-10-20',
                cantidad_estimada: 45,
                confianza: 0.92,
                antiguo: true // Flag to show it's an old prediction
            });
        }
        return of(null);
    }

    runPrediction(id_insumo: number, month: number): Observable<any> {
        // Simulates running Random Forest model
        console.log(`Running Random Forest for insumo ${id_insumo} month ${month}`);
        return of({
            fecha_prediccion: new Date().toISOString().split('T')[0],
            cantidad_estimada: Math.floor(Math.random() * 50) + 20,
            confianza: 0.85 + (Math.random() * 0.1),
            antiguo: false
        });
    }

    getPredictionStats(id_insumo: number): Observable<any[]> {
        // Mock data: Last 5 months real vs next month prediction
        return of([
            { mes: 'May', real: 45, prediccion: 48 },
            { mes: 'Jun', real: 52, prediccion: 50 },
            { mes: 'Jul', real: 49, prediccion: 55 },
            { mes: 'Ago', real: 60, prediccion: 58 },
            { mes: 'Sep', real: 55, prediccion: 55 },
            { mes: 'Oct', real: 0, prediccion: 62 }, // Current/Next month
        ]);
    }

    getForecastData(): Observable<any> {
        return of([
            { date: '2023-10-25', sales: 120 },
            { date: '2023-10-26', sales: 135 },
            { date: '2023-10-27', sales: 150 },
        ]);
    }
}
