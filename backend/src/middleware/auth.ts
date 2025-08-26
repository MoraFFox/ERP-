import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                username: string;
                fullName?: string;
                role: string;
            };
        }
    }
}

// JWT Authentication Middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
        
        // Verify token
        const decoded = jwt.verify(token, jwtSecret) as any;

        if (decoded.type !== 'access') {
            res.status(401).json({
                success: false,
                message: 'Invalid token type'
            });
            return;
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Attach user to request object
        req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName || undefined,
            role: user.role
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
            const decoded = jwt.verify(token, jwtSecret) as any;

            if (decoded.type === 'access') {
                const user = await prisma.user.findUnique({
                    where: { id: decoded.userId }
                });

                if (user) {
                    req.user = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        fullName: user.fullName || undefined,
                        role: user.role
                    };
                }
            }
        }

        next();
    } catch (error) {
        // Don't fail on optional auth, just continue without user
        next();
    }
};

// Role-based authorization middleware
export const requireRole = (roles: string | string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }

        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
            return;
        }

        next();
    };
};

// Admin only middleware
export const requireAdmin = requireRole('ADMIN');

// Manager or Admin middleware
export const requireManager = requireRole(['ADMIN', 'MANAGER']);

export default authenticateToken;
