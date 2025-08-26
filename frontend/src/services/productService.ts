import { apiRequest } from "./api"
import type { Product, ApiResponse, PaginatedResponse } from "@/types"

export interface ProductFilters {
  search?: string
  category?: string
  isActive?: boolean
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface CreateProductData {
  name: string
  description?: string
  sku: string
  category: string
  price: number
  cost?: number
  stockLevel: number
  minStock: number
  maxStock?: number
  unit: string
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  images?: string[]
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const response = await apiRequest.get("/api/products", filters)
    return response
  },

  async getProduct(id: string): Promise<Product> {
    const response: ApiResponse<Product> = await apiRequest.get(`/api/products/${id}`)

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch product")
    }

    return response.data
  },

  async createProduct(data: CreateProductData): Promise<Product> {
    const response: ApiResponse<Product> = await apiRequest.post("/api/products", data)

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to create product")
    }

    return response.data
  },

  async updateProduct(id: string, data: Partial<CreateProductData>): Promise<Product> {
    const response: ApiResponse<Product> = await apiRequest.put(`/api/products/${id}`, data)

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to update product")
    }

    return response.data
  },

  async deleteProduct(id: string): Promise<void> {
    const response: ApiResponse<void> = await apiRequest.delete(`/api/products/${id}`)

    if (!response.success) {
      throw new Error(response.message || "Failed to delete product")
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response: ApiResponse<string[]> = await apiRequest.get("/api/products/categories")
      if (response.success && response.data) {
        return response.data
      }
      return []
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      return []
    }
  },
}
