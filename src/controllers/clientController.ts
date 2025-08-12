import type { Response, NextFunction } from "express"
import { ClientService } from "../services/clientService"
import { createClientSchema, updateClientSchema, clientQuerySchema } from "../validation/client"
import type { AuthenticatedRequest } from "../types/auth"

export class ClientController {
  static async createClient(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const { error, value } = createClientSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        })
      }

      const client = await ClientService.createClient(value, req.user!.userId)
      res.status(201).json({
        success: true,
        message: "Client created successfully",
        data: client,
      })
    } catch (error) {
      next(error)
    }
  }

  static async getClient(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const client = await ClientService.getClientById(id)
      res.status(200).json({
        success: true,
        data: client,
      })
    } catch (error) {
      next(error)
    }
  }

  static async getClients(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      // Validate query parameters
      const { error, value } = clientQuerySchema.validate(req.query)
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        })
      }

      const result = await ClientService.getClients(value)
      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateClient(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      // Validate request body
      const { error, value } = updateClientSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        })
      }

      const client = await ClientService.updateClient(id, value)
      res.status(200).json({
        success: true,
        message: "Client updated successfully",
        data: client,
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteClient(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      await ClientService.deleteClient(id)
      res.status(200).json({
        success: true,
        message: "Client deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  }
}
