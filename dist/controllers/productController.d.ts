import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/auth";
export declare class ProductController {
    static createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    static getProducts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=productController.d.ts.map