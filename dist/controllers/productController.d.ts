import type { Request, Response, NextFunction } from "express";
export declare class ProductController {
    static createProduct(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getProduct(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getProducts(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static updateProduct(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=productController.d.ts.map