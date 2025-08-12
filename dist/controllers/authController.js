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
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
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
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
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
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map