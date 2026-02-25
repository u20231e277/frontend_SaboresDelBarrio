import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Venta } from '../models/venta.model';
import { Compra } from '../models/compra.model';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor() { }

    createVenta(venta: Venta): Observable<Venta> {
        console.log('Creating Venta', venta);
        return of(venta); // Stub
    }

    createCompra(compra: Compra): Observable<Compra> {
        console.log('Creating Compra', compra);
        return of(compra); // Stub
    }

    // Mock Data Methods for Dropdowns
    getClients(): Observable<any[]> {
        return of([
            { id_cliente: 101, nombre: 'Juan Perez', dni: '12345678' },
            { id_cliente: 102, nombre: 'Maria Delgado', dni: '87654321' },
            { id_cliente: 103, nombre: 'Empresa ABC', ruc: '20123456789' }
        ]);
    }

    getProviders(): Observable<any[]> {
        return of([
            { id_proveedor: 201, empresa: 'Distribuidora Lima', ruc: '20555555555' },
            { id_proveedor: 202, empresa: 'Agropecuaria del Sur', ruc: '20666666666' }
        ]);
    }

    getUsers(): Observable<any[]> {
        return of([
            { id_usuario: 1, nombre: 'Admin User', rol: 'Gerente' },
            { id_usuario: 2, nombre: 'Cajero 1', rol: 'Caja' },
            { id_usuario: 3, nombre: 'Jefe Cocina', rol: 'Cocina' }
        ]);
    }
}
