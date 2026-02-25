export interface Compra {
    id_compra?: number;
    fecha: Date;
    id_proveedor: number;
    id_usuario: number;
    subtotal: number;
    impuesto: number; // IGV 18%
    total: number;
    detalles: DetalleCompra[];
}

export interface DetalleCompra {
    id_detalle_compra?: number;
    id_compra?: number;
    id_insumo: number;
    cantidad: number;
    precio_unitario: number;
    // Helper for UI
    nombre_insumo?: string;
    subtotal?: number;
}
