import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SaleDTO, ClientDTO, DishDTO, UserDTO, WasteDTO } from '../models/api-dtos.model';

@Injectable({
    providedIn: 'root'
})
export class SalesService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    constructor() { }

    getSales(): Observable<SaleDTO[]> {
        return this.http.get<SaleDTO[]>(`${this.apiUrl}/sales`);
    }

    getSalesBetween(start: string, end: string): Observable<SaleDTO[]> {
        return this.http.get<SaleDTO[]>(`${this.apiUrl}/sales/between`, {
            params: { start, end }
        });
    }

    getSalesByClient(idClient: number): Observable<SaleDTO[]> {
        return this.http.get<SaleDTO[]>(`${this.apiUrl}/sales/by-client/${idClient}`);
    }

    getSalesByClientBetween(idClient: number, start: string, end: string): Observable<SaleDTO[]> {
        return this.http.get<SaleDTO[]>(`${this.apiUrl}/sales/client-between`, {
            params: { idClient, start, end }
        });
    }

    getDishQuantityBetween(idDish: number, start: string, end: string): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/salesdetails/dish/${idDish}/qty`, {
            params: { start, end }
        });
    }

    getDishAmountBetween(idDish: number, start: string, end: string): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/salesdetails/dish/${idDish}/amount`, {
            params: { start, end }
        });
    }

    getDishes(): Observable<DishDTO[]> {
        return this.http.get<DishDTO[]>(`${this.apiUrl}/dish`);
    }

    getWastes(): Observable<WasteDTO[]> {
        return this.http.get<WasteDTO[]>(`${this.apiUrl}/wastes`);
    }

    saveSale(sale: SaleDTO): Observable<SaleDTO> {
        return this.http.post<SaleDTO>(`${this.apiUrl}/sales`, sale);
    }

    getClients(): Observable<ClientDTO[]> {
        return this.http.get<ClientDTO[]>(`${this.apiUrl}/clients`);
    }

    getUsers(): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(`${this.apiUrl}/users`);
    }

    createClient(client: ClientDTO): Observable<ClientDTO> {
        return this.http.post<ClientDTO>(`${this.apiUrl}/clients`, client);
    }

    updateClient(id: number, client: ClientDTO): Observable<ClientDTO> {
        return this.http.put<ClientDTO>(`${this.apiUrl}/clients/${id}`, client);
    }

    deleteClient(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/clients/${id}`);
    }
}
