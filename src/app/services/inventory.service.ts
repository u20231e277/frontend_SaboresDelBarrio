import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Insumo } from '../models/insumo.model';
import { SupplyDTO, InventoryDTO, DishDTO } from '../models/api-dtos.model';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    constructor() { }

    getInsumos(): Observable<Insumo[]> {
        return forkJoin({
            supplies: this.http.get<SupplyDTO[]>(`${this.apiUrl}/supplies`),
            inventory: this.http.get<InventoryDTO[]>(`${this.apiUrl}/inventory`)
        }).pipe(
            map(({ supplies, inventory }) => {
                // Map inventory by supplyId for quick lookup
                const inventoryMap = new Map<number, number>();
                inventory.forEach(item => {
                    // Check if supplyId exists and use stockFinal or stockInicial as current stock
                    if (item.supplyId !== undefined && item.stockFinal !== undefined) {
                        inventoryMap.set(item.supplyId, item.stockFinal);
                    }
                });

                return supplies.map(supply => {
                    const currentStock = inventoryMap.get(supply.idSupplyDto!) || 0;
                    // Determine status logic (Threshold hardcoded for now)
                    const status = currentStock < 10 ? 'Reabastecer' : 'Suficiente';

                    return {
                        id_insumo: supply.idSupplyDto!,
                        nombre: supply.nameSupply,
                        unidad: supply.unitSupply,
                        vida_util_dias: supply.usefulLiSupply,
                        id_categoria_insumo: supply.idCategory,
                        stock__actual: currentStock,
                        estado__conservacion: status
                    };
                });
            })
        );
    }

    updateStock(id_insumo: number, cantidad: number): Observable<boolean> {
        // Logic to update stock would go here (e.g. POST to /inventory)
        // Since API structure for update is specific (likely creating a new Inventory record), 
        // we might leave this as a stub or implement if requested.
        console.log(`Updating stock for ${id_insumo}: ${cantidad}`);
        return of(true);
    }

    getPlatos(): Observable<any[]> {
        return this.http.get<DishDTO[]>(`${this.apiUrl}/dish`).pipe(
            map(dishes => dishes.map(d => ({
                id_plato: d.idDish,
                nombre: d.nameDish,
                priceDish: d.priceDish
            })))
        );
    }

    createSupply(supply: SupplyDTO): Observable<SupplyDTO> {
        return this.http.post<SupplyDTO>(`${this.apiUrl}/supplies`, supply);
    }
}
