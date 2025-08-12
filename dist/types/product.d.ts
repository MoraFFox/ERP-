export interface CreateProductRequest {
    name: string;
    description?: string;
    sku: string;
    category: string;
    price: number;
    cost?: number;
    stockLevel?: number;
    minStock?: number;
    maxStock?: number;
    unit?: string;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    images?: string[];
}
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
    isActive?: boolean;
}
export interface ProductResponse {
    id: string;
    name: string;
    description?: string;
    sku: string;
    category: string;
    price: number;
    cost?: number;
    stockLevel: number;
    minStock: number;
    maxStock?: number;
    unit: string;
    weight?: number;
    dimensions?: any;
    images: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
    };
}
export interface ProductListResponse {
    products: ProductResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=product.d.ts.map