import type { CreateProductRequest, UpdateProductRequest, ProductResponse, ProductListResponse } from "../types/product";
export declare class ProductService {
    static createProduct(data: CreateProductRequest, createdById: string): Promise<ProductResponse>;
    static getProductById(id: string): Promise<ProductResponse>;
    static getProducts(query: any): Promise<ProductListResponse>;
    static updateProduct(id: string, data: UpdateProductRequest): Promise<ProductResponse>;
    static deleteProduct(id: string): Promise<void>;
}
//# sourceMappingURL=productService.d.ts.map