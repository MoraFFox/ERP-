"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = Buffer.from(process.env.JWT_SECRET || "secret");
const JWT_REFRESH_SECRET = Buffer.from(process.env.JWT_REFRESH_SECRET || "secret_refresh");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
class JWTUtils {
    static generateAccessToken(payload) {
        const options = { expiresIn: JWT_EXPIRES_IN };
        return jsonwebtoken_1.default.sign({ ...payload, type: "access" }, JWT_SECRET, options);
    }
    static generateRefreshToken(payload) {
        const options = { expiresIn: JWT_REFRESH_EXPIRES_IN };
        return jsonwebtoken_1.default.sign({ ...payload, type: "refresh" }, JWT_REFRESH_SECRET, options);
    }
    static verifyAccessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (typeof decoded !== 'object' || decoded === null) {
                throw new Error('Invalid token');
            }
            const payload = decoded;
            if (payload.type !== 'access') {
                throw new Error('Invalid token type');
            }
            return payload;
        }
        catch (error) {
            throw new Error("Invalid or expired access token");
        }
    }
    static verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
            if (typeof decoded !== 'object' || decoded === null) {
                throw new Error('Invalid token');
            }
            const payload = decoded;
            if (payload.type !== 'refresh') {
                throw new Error('Invalid token type');
            }
            return payload;
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