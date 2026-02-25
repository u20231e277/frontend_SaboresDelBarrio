export interface Venta {
    id_venta?: number;
    fecha: Date;
    id_cliente: number;
    id_usuario: number;
    subtotal: number;
    impuesto: number;
    total: number;
    detalles: DetalleVenta[];
}

export interface DetalleVenta {
    id_detalle_venta?: number;
    id_venta?: number;
    id_plato: number;
    cantidad: number;
    precio_unitario: number;
    // Helper for UI
    nombre_plato?: string;
    subtotal?: number;
}
