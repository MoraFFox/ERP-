"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const auth_1 = require("../validation/auth");
class AuthController {
    static async register(req, res, next) {
        try {
            const { error, value } = auth_1.registerSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const result = await authService_1.AuthService.register(value);
            return res.status(201).json(result);
        }
        catch (error) {
            return next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { error, value } = auth_1.loginSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const result = await authService_1.AuthService.login(value);
            return res.status(200).json(result);
        }
        catch (error) {
            return next(error);
        }
    }
    static async refreshToken(req, res, next) {
        try {
            const { error, value } = auth_1.refreshTokenSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const result = await authService_1.AuthService.refreshToken(value.refreshToken);
            return res.status(200).json(result);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map