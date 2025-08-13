import type { Request, Response, NextFunction } from "express"
import { ClientService } from "../services/clientService"
import { createClientSchema, updateClientSchema, clientQuerySchema } from "../validation/client"
import type { AuthenticatedRequest } from "../types/auth"

export class ClientController {
  static async createClient(req: Request, res: Response, next: NextFunction) {
    const authReq = req as unknown as AuthenticatedRequest;
    try {
      // Validate request body
      const { error, value } = createClientSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      const client = await ClientService.createClient(value, authReq.user!.userId);
      return res.status(201).json({
        success: true,
        message: "Client created successfully",
        data: client,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getClient(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const client = await ClientService.getClientById(id);
      return res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getClients(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate query parameters
      const { error, value } = clientQuerySchema.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      const result = await ClientService.getClients(value);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateClient(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validate request body
      const { error, value } = updateClientSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      const client = await ClientService.updateClient(id, value);
      return res.status(200).json({
        success: true,
        message: "Client updated successfully",
        data: client,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteClient(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ClientService.deleteClient(id);
      return res.status(200).json({
        success: true,
        message: "Client deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
}
