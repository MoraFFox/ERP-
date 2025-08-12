import type { Response, NextFunction } from "express"
import { ProductService } from "../services/productService"
import { createProductSchema, updateProductSchema, productQuerySchema } from "../validation/product"
import type { AuthenticatedRequest } from "../types/auth"

export class ProductController {
  static async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

      const product = await ProductService.createProduct(value, req.user!.userId)
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  static async getProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const product = await ProductService.getProductById(id)
      res.status(200).json({
        success: true,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  static async getProducts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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
      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

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
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      await ProductService.deleteProduct(id)
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  }
}
