"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
class AuthService {
    static async register(data) {
        const { email, password, firstName, lastName, roleId } = data;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw (0, errorHandler_1.createError)("User with this email already exists", 409);
        }
        let finalRoleId = roleId;
        if (!finalRoleId) {
            const defaultRole = await prisma.role.findFirst({
                where: { name: "User" },
            });
            if (!defaultRole) {
                const newRole = await prisma.role.create({
                    data: {
                        name: "User",
                        description: "Default user role",
                        permissions: ["read:own_profile", "update:own_profile"],
                    },
                });
                finalRoleId = newRole.id;
            }
            else {
                finalRoleId = defaultRole.id;
            }
        }
        const hashedPassword = await password_1.PasswordUtils.hash(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                roleId: finalRoleId,
            },
            include: {
                role: true,
            },
        });
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            roleId: user.roleId,
        };
        const { accessToken, refreshToken } = jwt_1.JWTUtils.generateTokenPair(tokenPayload);
        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            },
        };
    }
    static async login(data) {
        const { email, password } = data;
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            throw (0, errorHandler_1.createError)("Invalid email or password", 401);
        }
        if (!user.isActive) {
            throw (0, errorHandler_1.createError)("Account is deactivated", 401);
        }
        const isPasswordValid = await password_1.PasswordUtils.compare(password, user.password);
        if (!isPasswordValid) {
            throw (0, errorHandler_1.createError)("Invalid email or password", 401);
        }
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            roleId: user.roleId,
        };
        const { accessToken, refreshToken } = jwt_1.JWTUtils.generateTokenPair(tokenPayload);
        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            },
        };
    }
    static async refreshToken(refreshToken) {
        try {
            const decoded = jwt_1.JWTUtils.verifyRefreshToken(refreshToken);
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                include: { role: true },
            });
            if (!user || !user.isActive) {
                throw (0, errorHandler_1.createError)("User not found or inactive", 401);
            }
            const tokenPayload = {
                userId: user.id,
                email: user.email,
                roleId: user.roleId,
            };
            const tokens = jwt_1.JWTUtils.generateTokenPair(tokenPayload);
            return {
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                    },
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
            };
        }
        catch (error) {
            throw (0, errorHandler_1.createError)("Invalid or expired refresh token", 401);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map
