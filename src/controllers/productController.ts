import type { Request, Response, NextFunction } from "express"
import { ProductService } from "../services/productService"
import { createProductSchema, updateProductSchema, productQuerySchema } from "../validation/product"
import type { AuthenticatedRequest } from "../types/auth"

export class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    const authReq = req as unknown as AuthenticatedRequest
    try {
      // Validate request body
      const { error, value } = createProductSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        })
      }

      const product = await ProductService.createProduct(value, authReq.user!.userId)
      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async getProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
      const product = await ProductService.getProductById(id)
      return res.status(200).json({
        success: true,
        data: product,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate query parameters
      const { error, value } = productQuerySchema.validate(req.query)
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        })
      }

      const result = await ProductService.getProducts(value)
      return res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    const authReq = req as unknown as AuthenticatedRequest
    const { id } = req.params
    try {
      // Validate request body
      const { error, value } = updateProductSchema.validate(req.body)
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        })
      }

      const product = await ProductService.updateProduct(id, value)
      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
      await ProductService.deleteProduct(id)
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      })
    } catch (error) {
      return next(error)
    }
  }
}
