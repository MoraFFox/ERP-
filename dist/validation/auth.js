"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is required",
    }),
    firstName: joi_1.default.string().min(2).max(50).required().messages({
        "string.min": "First name must be at least 2 characters long",
        "string.max": "First name cannot exceed 50 characters",
        "any.required": "First name is required",
    }),
    lastName: joi_1.default.string().min(2).max(50).required().messages({
        "string.min": "Last name must be at least 2 characters long",
        "string.max": "Last name cannot exceed 50 characters",
        "any.required": "Last name is required",
    }),
    roleId: joi_1.default.string().optional(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().required().messages({
        "any.required": "Password is required",
    }),
});
exports.refreshTokenSchema = joi_1.default.object({
    refreshToken: joi_1.default.string().required().messages({
        "any.required": "Refresh token is required",
    }),
});
//# sourceMappingURL=auth.js.map
