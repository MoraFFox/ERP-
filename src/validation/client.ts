import Joi from "joi"

export const createClientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Client name must be at least 2 characters long",
    "string.max": "Client name cannot exceed 100 characters",
    "any.required": "Client name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  phone: Joi.string()
    .pattern(/^[+]?[1-9][\d]{0,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),

  address: Joi.string().max(200).optional(),
  city: Joi.string().max(50).optional(),
  state: Joi.string().max(50).optional(),
  zipCode: Joi.string().max(20).optional(),
  country: Joi.string().max(50).optional(),
  website: Joi.string().uri().optional().messages({
    "string.uri": "Please provide a valid website URL",
  }),

  industry: Joi.string().max(50).optional(),
  companySize: Joi.string().valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+").optional(),
  notes: Joi.string().max(1000).optional(),
})

export const updateClientSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^[+]?[1-9][\d]{0,15}$/)
    .optional(),
  address: Joi.string().max(200).optional(),
  city: Joi.string().max(50).optional(),
  state: Joi.string().max(50).optional(),
  zipCode: Joi.string().max(20).optional(),
  country: Joi.string().max(50).optional(),
  website: Joi.string().uri().optional(),
  industry: Joi.string().max(50).optional(),
  companySize: Joi.string().valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+").optional(),
  status: Joi.string().valid("ACTIVE", "INACTIVE", "PROSPECT", "CHURNED").optional(),
  notes: Joi.string().max(1000).optional(),
})

export const clientQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().max(100).optional(),
  status: Joi.string().valid("ACTIVE", "INACTIVE", "PROSPECT", "CHURNED").optional(),
  industry: Joi.string().max(50).optional(),
  sortBy: Joi.string().valid("name", "email", "createdAt", "updatedAt").default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
})
