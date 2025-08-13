import type { Request, Response, NextFunction } from "express";
export declare class AuthController {
    static register(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static login(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static refreshToken(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=authController.d.ts.map