"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createProductSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required().messages({
        "string.min": "Product name must be at least 2 characters long",
        "string.max": "Product name cannot exceed 100 characters",
        "any.required": "Product name is required",
    }),
    description: joi_1.default.string().max(1000).optional(),
    sku: joi_1.default.string().min(2).max(50).required().messages({
        "string.min": "SKU must be at least 2 characters long",
        "string.max": "SKU cannot exceed 50 characters",
        "any.required": "SKU is required",
    }),
    category: joi_1.default.string().min(2).max(50).required().messages({
        "string.min": "Category must be at least 2 characters long",
        "string.max": "Category cannot exceed 50 characters",
        "any.required": "Category is required",
    }),
    price: joi_1.default.number().positive().precision(2).required().messages({
        "number.positive": "Price must be a positive number",
        "any.required": "Price is required",
    }),
    cost: joi_1.default.number().positive().precision(2).optional().messages({
        "number.positive": "Cost must be a positive number",
    }),
    stockLevel: joi_1.default.number().integer().min(0).default(0),
    minStock: joi_1.default.number().integer().min(0).default(0),
    maxStock: joi_1.default.number().integer().min(0).optional(),
    unit: joi_1.default.string().max(20).default("piece"),
    weight: joi_1.default.number().positive().precision(2).optional().messages({
        "number.positive": "Weight must be a positive number",
    }),
    dimensions: joi_1.default.object({
        length: joi_1.default.number().positive().precision(2).optional(),
        width: joi_1.default.number().positive().precision(2).optional(),
        height: joi_1.default.number().positive().precision(2).optional(),
    }).optional(),
    images: joi_1.default.array().items(joi_1.default.string().uri()).max(10).optional().messages({
        "array.max": "Maximum 10 images allowed",
    }),
});
exports.updateProductSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).optional(),
    description: joi_1.default.string().max(1000).optional(),
    sku: joi_1.default.string().min(2).max(50).optional(),
    category: joi_1.default.string().min(2).max(50).optional(),
    price: joi_1.default.number().positive().precision(2).optional(),
    cost: joi_1.default.number().positive().precision(2).optional(),
    stockLevel: joi_1.default.number().integer().min(0).optional(),
    minStock: joi_1.default.number().integer().min(0).optional(),
    maxStock: joi_1.default.number().integer().min(0).optional(),
    unit: joi_1.default.string().max(20).optional(),
    weight: joi_1.default.number().positive().precision(2).optional(),
    dimensions: joi_1.default.object({
        length: joi_1.default.number().positive().precision(2).optional(),
        width: joi_1.default.number().positive().precision(2).optional(),
        height: joi_1.default.number().positive().precision(2).optional(),
    }).optional(),
    images: joi_1.default.array().items(joi_1.default.string().uri()).max(10).optional(),
    isActive: joi_1.default.boolean().optional(),
});
exports.productQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(20),
    search: joi_1.default.string().max(100).optional(),
    category: joi_1.default.string().max(50).optional(),
    isActive: joi_1.default.boolean().optional(),
    minPrice: joi_1.default.number().positive().optional(),
    maxPrice: joi_1.default.number().positive().optional(),
    sortBy: joi_1.default.string().valid("name", "sku", "price", "stockLevel", "createdAt", "updatedAt").default("createdAt"),
    sortOrder: joi_1.default.string().valid("asc", "desc").default("desc"),
});
//# sourceMappingURL=product.js.map