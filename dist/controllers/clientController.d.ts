import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/auth";
export declare class ClientController {
    static createClient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getClient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    static getClients(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static updateClient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteClient(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=clientController.d.ts.map