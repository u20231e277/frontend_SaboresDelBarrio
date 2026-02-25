import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BuyDTO, ProviderDTO, SupplyDTO, UserDTO } from '../models/api-dtos.model';

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    constructor() { }

    getPurchases(): Observable<BuyDTO[]> {
        return this.http.get<BuyDTO[]>(`${this.apiUrl}/buys`);
    }

    savePurchase(buy: BuyDTO): Observable<BuyDTO> {
        return this.http.post<BuyDTO>(`${this.apiUrl}/buys`, buy);
    }

    getProviders(): Observable<ProviderDTO[]> {
        return this.http.get<ProviderDTO[]>(`${this.apiUrl}/provider`);
    }

    getUsers(): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(`${this.apiUrl}/users`);
    }
}
