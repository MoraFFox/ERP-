"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
class ProductService {
    static async createProduct(data, createdById) {
        const existingProduct = await prisma.product.findUnique({
            where: { sku: data.sku },
        });
        if (existingProduct) {
            throw (0, errorHandler_1.createError)("Product with this SKU already exists", 409);
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
        });
        return {
            id: product.id,
            name: product.name,
            description: product.description ?? undefined,
            sku: product.sku,
            category: product.category,
            price: Number(product.price),
            cost: product.cost != null ? Number(product.cost) : undefined,
            stockLevel: product.stockLevel,
            minStock: product.minStock,
            maxStock: product.maxStock ?? undefined,
            unit: product.unit,
            weight: product.weight != null ? Number(product.weight) : undefined,
            dimensions: product.dimensions,
            images: product.images,
            isActive: product.isActive,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            createdBy: product.createdBy,
        };
    }
    static async getProductById(id) {
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
        });
        if (!product) {
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        return {
            id: product.id,
            name: product.name,
            description: product.description ?? undefined,
            sku: product.sku,
            category: product.category,
            price: Number(product.price),
            cost: product.cost != null ? Number(product.cost) : undefined,
            stockLevel: product.stockLevel,
            minStock: product.minStock,
            maxStock: product.maxStock ?? undefined,
            unit: product.unit,
            weight: product.weight != null ? Number(product.weight) : undefined,
            dimensions: product.dimensions,
            images: product.images,
            isActive: product.isActive,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            createdBy: product.createdBy,
        };
    }
    static async getProducts(query) {
        const { page, limit, search, category, isActive, minPrice, maxPrice, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
            ];
        }
        if (category) {
            where.category = { contains: category, mode: "insensitive" };
        }
        if (typeof isActive === "boolean") {
            where.isActive = isActive;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) {
                where.price.gte = minPrice;
            }
            if (maxPrice !== undefined) {
                where.price.lte = maxPrice;
            }
        }
        const total = await prisma.product.count({ where });
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
        });
        const formattedProducts = products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description ?? undefined,
            sku: product.sku,
            category: product.category,
            price: Number(product.price),
            cost: product.cost != null ? Number(product.cost) : undefined,
            stockLevel: product.stockLevel,
            minStock: product.minStock,
            maxStock: product.maxStock ?? undefined,
            unit: product.unit,
            weight: product.weight != null ? Number(product.weight) : undefined,
            dimensions: product.dimensions,
            images: product.images,
            isActive: product.isActive,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            createdBy: product.createdBy,
        }));
        return {
            products: formattedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async updateProduct(id, data) {
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        if (data.sku && data.sku !== existingProduct.sku) {
            const skuExists = await prisma.product.findUnique({
                where: { sku: data.sku },
            });
            if (skuExists) {
                throw (0, errorHandler_1.createError)("Product with this SKU already exists", 409);
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
        });
        return {
            id: product.id,
            name: product.name,
            description: product.description ?? undefined,
            sku: product.sku,
            category: product.category,
            price: Number(product.price),
            cost: product.cost != null ? Number(product.cost) : undefined,
            stockLevel: product.stockLevel,
            minStock: product.minStock,
            maxStock: product.maxStock ?? undefined,
            unit: product.unit,
            weight: product.weight != null ? Number(product.weight) : undefined,
            dimensions: product.dimensions,
            images: product.images,
            isActive: product.isActive,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            createdBy: product.createdBy,
        };
    }
    static async deleteProduct(id) {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw (0, errorHandler_1.createError)("Product not found", 404);
        }
        await prisma.product.delete({
            where: { id },
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=productService.js.map
