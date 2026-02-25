import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SaleDTO, ClientDTO, DishDTO, UserDTO } from '../models/api-dtos.model';

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
