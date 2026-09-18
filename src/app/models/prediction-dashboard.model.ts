export type PredictionHorizon = 3 | 7 | 14;
export type SupplyState = 'REQUIERE_COMPRA' | 'STOCK_SUFICIENTE';

export interface DashboardHealth {
  java_api: { status: 'UP' | 'DOWN' };
  fastapi: { status: 'UP' | 'DOWN' };
  database: { status: 'UP' | 'DOWN' };
}

export interface SupplyRecommendation {
  id_insumo: number;
  nombre_insumo: string;
  categoria_insumo: string;
  unidad: string;
  stock_actual: number;
  prediccion_3_dias: number;
  prediccion_7_dias: number;
  prediccion_14_dias: number;
  compra_recomendada: number;
  estado: SupplyState;
}

export interface PredictionDashboard {
  fecha_decision: string;
  version_modelo: string;
  margen_seguridad: number;
  horizonte_recomendacion: PredictionHorizon;
  ultima_actualizacion: string;
  indicadores: {
    insumos_analizados: number;
    requieren_compra: number;
    stock_suficiente: number;
    porcentaje_requieren_compra: number;
    porcentaje_stock_suficiente: number;
  };
  consumo_por_insumo: SupplyRecommendation[];
  estado_abastecimiento: {
    requieren_compra: number;
    stock_suficiente: number;
  };
  recomendaciones: SupplyRecommendation[];
}
