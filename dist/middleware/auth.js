"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token required",
        });
    }
    try {
        const decoded = jwt_1.JWTUtils.verifyAccessToken(token);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            roleId: decoded.roleId,
        };
        next();
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
        try {
            const decoded = jwt_1.JWTUtils.verifyAccessToken(token);
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                roleId: decoded.roleId,
            };
        }
        catch (error) {
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map