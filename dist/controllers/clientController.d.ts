import type { Request, Response, NextFunction } from "express";
export declare class ClientController {
    static createClient(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getClient(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static getClients(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static updateClient(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    static deleteClient(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=clientController.d.ts.map