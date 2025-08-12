import { PrismaClient } from "@prisma/client"
import type { CreateProductRequest, UpdateProductRequest, ProductResponse, ProductListResponse } from "../types/product"
import { createError } from "../middleware/errorHandler"

const prisma = new PrismaClient()

export class ProductService {
  static async createProduct(data: CreateProductRequest, createdById: string): Promise<ProductResponse> {
    // Check if product with SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku: data.sku },
    })

    if (existingProduct) {
      throw createError("Product with this SKU already exists", 409)
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        createdById,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      category: product.category,
      price: Number(product.price),
      cost: product.cost ? Number(product.cost) : undefined,
      stockLevel: product.stockLevel,
      minStock: product.minStock,
      maxStock: product.maxStock,
      unit: product.unit,
      weight: product.weight ? Number(product.weight) : undefined,
      dimensions: product.dimensions,
      images: product.images,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      createdBy: product.createdBy,
    }
  }

  static async getProductById(id: string): Promise<ProductResponse> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!product) {
      throw createError("Product not found", 404)
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      category: product.category,
      price: Number(product.price),
      cost: product.cost ? Number(product.cost) : undefined,
      stockLevel: product.stockLevel,
      minStock: product.minStock,
      maxStock: product.maxStock,
      unit: product.unit,
      weight: product.weight ? Number(product.weight) : undefined,
      dimensions: product.dimensions,
      images: product.images,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      createdBy: product.createdBy,
    }
  }

  static async getProducts(query: any): Promise<ProductListResponse> {
    const { page, limit, search, category, isActive, minPrice, maxPrice, sortBy, sortOrder } = query

    const skip = (page - 1) * limit
    const where: any = {}

    // Build search conditions
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ]
    }

    if (category) {
      where.category = { contains: category, mode: "insensitive" }
    }

    if (typeof isActive === "boolean") {
      where.isActive = isActive
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) {
        where.price.gte = minPrice
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice
      }
    }

    // Get total count
    const total = await prisma.product.count({ where })

    // Get products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    const formattedProducts: ProductResponse[] = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      category: product.category,
      price: Number(product.price),
      cost: product.cost ? Number(product.cost) : undefined,
      stockLevel: product.stockLevel,
      minStock: product.minStock,
      maxStock: product.maxStock,
      unit: product.unit,
      weight: product.weight ? Number(product.weight) : undefined,
      dimensions: product.dimensions,
      images: product.images,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      createdBy: product.createdBy,
    }))

    return {
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async updateProduct(id: string, data: UpdateProductRequest): Promise<ProductResponse> {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      throw createError("Product not found", 404)
    }

    // Check if SKU is being updated and already exists
    if (data.sku && data.sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku: data.sku },
      })

      if (skuExists) {
        throw createError("Product with this SKU already exists", 409)
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      category: product.category,
      price: Number(product.price),
      cost: product.cost ? Number(product.cost) : undefined,
      stockLevel: product.stockLevel,
      minStock: product.minStock,
      maxStock: product.maxStock,
      unit: product.unit,
      weight: product.weight ? Number(product.weight) : undefined,
      dimensions: product.dimensions,
      images: product.images,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      createdBy: product.createdBy,
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      throw createError("Product not found", 404)
    }

    await prisma.product.delete({
      where: { id },
    })
  }
}
