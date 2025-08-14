"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientQuerySchema = exports.updateClientSchema = exports.createClientSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createClientSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required().messages({
        "string.min": "Client name must be at least 2 characters long",
        "string.max": "Client name cannot exceed 100 characters",
        "any.required": "Client name is required",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    phone: joi_1.default.string()
        .pattern(/^[+]?[1-9][\d]{0,15}$/)
        .optional()
        .messages({
        "string.pattern.base": "Please provide a valid phone number",
    }),
    address: joi_1.default.string().max(200).optional(),
    city: joi_1.default.string().max(50).optional(),
    state: joi_1.default.string().max(50).optional(),
    zipCode: joi_1.default.string().max(20).optional(),
    country: joi_1.default.string().max(50).optional(),
    website: joi_1.default.string().uri().optional().messages({
        "string.uri": "Please provide a valid website URL",
    }),
    industry: joi_1.default.string().max(50).optional(),
    companySize: joi_1.default.string().valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+").optional(),
    notes: joi_1.default.string().max(1000).optional(),
});
exports.updateClientSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).optional(),
    email: joi_1.default.string().email().optional(),
    phone: joi_1.default.string()
        .pattern(/^[+]?[1-9][\d]{0,15}$/)
        .optional(),
    address: joi_1.default.string().max(200).optional(),
    city: joi_1.default.string().max(50).optional(),
    state: joi_1.default.string().max(50).optional(),
    zipCode: joi_1.default.string().max(20).optional(),
    country: joi_1.default.string().max(50).optional(),
    website: joi_1.default.string().uri().optional(),
    industry: joi_1.default.string().max(50).optional(),
    companySize: joi_1.default.string().valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+").optional(),
    status: joi_1.default.string().valid("ACTIVE", "INACTIVE", "PROSPECT", "CHURNED").optional(),
    notes: joi_1.default.string().max(1000).optional(),
});
exports.clientQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(20),
    search: joi_1.default.string().max(100).optional(),
    status: joi_1.default.string().valid("ACTIVE", "INACTIVE", "PROSPECT", "CHURNED").optional(),
    industry: joi_1.default.string().max(50).optional(),
    sortBy: joi_1.default.string().valid("name", "email", "createdAt", "updatedAt").default("createdAt"),
    sortOrder: joi_1.default.string().valid("asc", "desc").default("desc"),
});
//# sourceMappingURL=client.js.map
