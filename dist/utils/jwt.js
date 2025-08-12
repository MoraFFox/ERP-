"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
class JWTUtils {
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign({ ...payload, type: "access" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign({ ...payload, type: "refresh" }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
    }
    static verifyAccessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (decoded.type !== "access") {
                throw new Error("Invalid token type");
            }
            return decoded;
        }
        catch (error) {
            throw new Error("Invalid or expired access token");
        }
    }
    static verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
            if (decoded.type !== "refresh") {
                throw new Error("Invalid token type");
            }
            return decoded;
        }
        catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }
    static generateTokenPair(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }
}
exports.JWTUtils = JWTUtils;
//# sourceMappingURL=jwt.js.map