import Joi from "joi"

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Product name must be at least 2 characters long",
    "string.max": "Product name cannot exceed 100 characters",
    "any.required": "Product name is required",
  }),

  description: Joi.string().max(1000).optional(),

  sku: Joi.string().min(2).max(50).required().messages({
    "string.min": "SKU must be at least 2 characters long",
    "string.max": "SKU cannot exceed 50 characters",
    "any.required": "SKU is required",
  }),

  category: Joi.string().min(2).max(50).required().messages({
    "string.min": "Category must be at least 2 characters long",
    "string.max": "Category cannot exceed 50 characters",
    "any.required": "Category is required",
  }),

  price: Joi.number().positive().precision(2).required().messages({
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),

  cost: Joi.number().positive().precision(2).optional().messages({
    "number.positive": "Cost must be a positive number",
  }),

  stockLevel: Joi.number().integer().min(0).default(0),
  minStock: Joi.number().integer().min(0).default(0),
  maxStock: Joi.number().integer().min(0).optional(),

  unit: Joi.string().max(20).default("piece"),

  weight: Joi.number().positive().precision(2).optional().messages({
    "number.positive": "Weight must be a positive number",
  }),

  dimensions: Joi.object({
    length: Joi.number().positive().precision(2).optional(),
    width: Joi.number().positive().precision(2).optional(),
    height: Joi.number().positive().precision(2).optional(),
  }).optional(),

  images: Joi.array().items(Joi.string().uri()).max(10).optional().messages({
    "array.max": "Maximum 10 images allowed",
  }),
})

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(1000).optional(),
  sku: Joi.string().min(2).max(50).optional(),
  category: Joi.string().min(2).max(50).optional(),
  price: Joi.number().positive().precision(2).optional(),
  cost: Joi.number().positive().precision(2).optional(),
  stockLevel: Joi.number().integer().min(0).optional(),
  minStock: Joi.number().integer().min(0).optional(),
  maxStock: Joi.number().integer().min(0).optional(),
  unit: Joi.string().max(20).optional(),
  weight: Joi.number().positive().precision(2).optional(),
  dimensions: Joi.object({
    length: Joi.number().positive().precision(2).optional(),
    width: Joi.number().positive().precision(2).optional(),
    height: Joi.number().positive().precision(2).optional(),
  }).optional(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional(),
  isActive: Joi.boolean().optional(),
})

export const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().max(100).optional(),
  category: Joi.string().max(50).optional(),
  isActive: Joi.boolean().optional(),
  minPrice: Joi.number().positive().optional(),
  maxPrice: Joi.number().positive().optional(),
  sortBy: Joi.string().valid("name", "sku", "price", "stockLevel", "createdAt", "updatedAt").default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
})
