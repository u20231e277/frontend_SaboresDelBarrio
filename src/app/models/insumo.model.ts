// Adapted model to fit SupplyDTO from backend but keep frontend utility
export interface Insumo {
    id_insumo: number; // Maps to idSupplyDto
    nombre: string;    // Maps to nameSupply
    unidad: string;    // Maps to unitSupply
    vida_util_dias: number; // Maps to usefulLiSupply
    id_categoria_insumo: number; // Maps to idCategory

    // Derived/Joined fields
    stock__actual?: number;
    estado__conservacion?: string;
}

export interface CategoriaInsumo {
    id_categoria_insumo: number;
    nombre: string;
}
