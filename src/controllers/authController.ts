import type { Request, Response, NextFunction } from "express"
import { AuthService } from "../services/authService"
import { registerSchema, loginSchema, refreshTokenSchema } from "../validation/auth"

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const { error, value } = registerSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        })
      }

      const result = await AuthService.register(value)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const { error, value } = loginSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        })
      }

      const result = await AuthService.login(value)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const { error, value } = refreshTokenSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        })
      }

      const result = await AuthService.refreshToken(value.refreshToken)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}
