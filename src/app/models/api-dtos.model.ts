export interface WasteDTO {
    idWaste?: number;
    dateWaste: string; // date-time
    idSupplyWaste: number;
    quantityWaste: number;
    reasonWaste: string;
}

export interface RoleDTO {
    idRole?: number;
    nameOfRole: string;
}

export interface UserDTO {
    idUser?: number;
    role: RoleDTO;
    emailUser: string;
    passwordUser?: string; // writeBy
    name: string;
}

export interface SupplyDTO {
    idSupplyDto?: number;
    idCategory: number;
    nameSupply: string;
    unitSupply: string;
    usefulLiSupply: number;
}

export interface RecipeDTO {
    idRecipe?: number;
    dishRecipe: number;
    supplyRecipe: number;
    quantityRecipe: number;
}

export interface ProviderDTO {
    idProvider?: number;
    nameProvider: string;
    phoneProvider: string;
    emailProvider: string;
}

export interface InventoryDTO {
    idInventary?: number;
    fecha?: string; // date-time
    supplyId?: number;
    supplyName?: string;
    stockInicial?: number;
    stockFinal?: number;
}

export interface CategoryDishDTO {
    idCategoryDish?: number;
    nameCategoryDish: string;
}

export interface DishDTO {
    idDish?: number;
    categoryDish: CategoryDishDTO;
    nameDish: string;
    priceDish: number;
}

export interface ClientDTO {
    idClient?: number;
    nameOfClient: string;
    phoneNumber: string;
    emailClient: string;
}

export interface CategorySupplyDTO {
    idCategory?: number;
    nameofCategory: string;
}

export interface SaleDetailDTO {
    idSaleDetail?: number; // readOnly
    idDish: number;
    quantity: number;
    unitPrice?: number; // readOnly
}

export interface SaleDTO {
    idSale?: number; // readOnly
    dateTime?: string; // readOnly
    idClient: number;
    idUser: number;
    subtotal?: number; // readOnly
    tax?: number; // readOnly
    total?: number; // readOnly
    details: SaleDetailDTO[];
}

export interface BuyDetailDTO {
    idBuyDetail?: number; // readOnly
    idSupply: number;
    quantity: number;
    unitPrice: number;
}

export interface BuyDTO {
    idBuy?: number; // readOnly
    dateTime?: string; // readOnly
    idProvider: number;
    idUser: number;
    subtotal?: number; // readOnly
    tax?: number; // readOnly
    total?: number; // readOnly
    details: BuyDetailDTO[];
}
