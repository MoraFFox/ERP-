"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const authenticateToken = (req, res, next) => {
    const authHeader = req.get('authorization');
    const token = authHeader ? authHeader.split(" ")[1] : undefined;
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Access token required",
        });
        return;
    }
    try {
        const decoded = jwt_1.JWTUtils.verifyAccessToken(token);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            roleId: decoded.roleId,
        };
        next();
        return;
    }
    catch (error) {
        res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
        return;
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = (req, res, next) => {
    const authHeader = req.get('authorization');
    const token = authHeader ? authHeader.split(" ")[1] : undefined;
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
    return;
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map