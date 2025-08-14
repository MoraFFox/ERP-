"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtils = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 12;
class PasswordUtils {
    static async hash(password) {
        try {
            return await bcrypt_1.default.hash(password, SALT_ROUNDS);
        }
        catch (error) {
            throw new Error("Failed to hash password");
        }
    }
    static async compare(password, hashedPassword) {
        try {
            return await bcrypt_1.default.compare(password, hashedPassword);
        }
        catch (error) {
            throw new Error("Failed to compare passwords");
        }
    }
    static validate(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push("Password must contain at least one number");
        }
        if (!/(?=.*[@$!%*?&])/.test(password)) {
            errors.push("Password must contain at least one special character (@$!%*?&)");
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}
exports.PasswordUtils = PasswordUtils;
//# sourceMappingURL=password.js.map
