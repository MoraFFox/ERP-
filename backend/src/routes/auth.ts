import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateUser } from '../validation/auth';

const router = Router();
const prisma = new PrismaClient();

// JWT token generation helper
const generateTokens = (userId: string) => {
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
    const accessTokenExpiry = process.env.JWT_EXPIRES_IN || '15m';
    const refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    const accessToken = jwt.sign(
        { userId, type: 'access' },
        jwtSecret,
        { expiresIn: accessTokenExpiry } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        refreshSecret,
        { expiresIn: refreshTokenExpiry } as jwt.SignOptions
    );

    return { accessToken, refreshToken };
};

// Register endpoint
router.post('/register', validateUser, asyncHandler(async (req, res) => {
    try {
        const { email, username, password, fullName } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: existingUser.email === email
                    ? 'Email already registered'
                    : 'Username already taken'
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                fullName
            },
        });

        // Generate JWT tokens
        const { accessToken, refreshToken } = generateTokens(user.id);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            success: true,
            data: {
                user: userWithoutPassword,
                accessToken,
                refreshToken
            },
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
}));

// Login endpoint
router.post('/login', asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }

        // Find user by email
        console.log('Attempting to find user with email:', email);
        const user = await prisma.user.findUnique({
            where: { email },
        });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }

        // Generate JWT tokens
        const { accessToken, refreshToken } = generateTokens(user.id);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            data: {
                user: userWithoutPassword,
                accessToken,
                refreshToken
            },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
}));

// Refresh token endpoint
router.post('/refresh', asyncHandler(async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(401).json({
                success: false,
                message: 'Refresh token is required'
            });
            return;
        }

        const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, refreshSecret) as any;

        if (decoded.type !== 'refresh') {
            res.status(401).json({
                success: false,
                message: 'Invalid token type'
            });
            return;
        }

        // Check if user still exists
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

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

        res.json({
            success: true,
            data: {
                accessToken,
                refreshToken: newRefreshToken
            },
            message: 'Tokens refreshed successfully'
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });
    }
}));

// Logout endpoint (client-side token removal, but we can blacklist if needed)
router.post('/logout', asyncHandler(async (req, res) => {
    // In a more advanced implementation, you might want to blacklist the token
    // For now, we just return success as the client will remove the token
    res.json({
        success: true,
        message: 'Logout successful'
    });
}));

// Verify token endpoint
router.get('/verify', asyncHandler(async (req, res) => {
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
        const decoded = jwt.verify(token, jwtSecret) as any;

        if (decoded.type !== 'access') {
            res.status(401).json({
                success: false,
                message: 'Invalid token type'
            });
            return;
        }

        // Get user details
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

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            data: {
                user: userWithoutPassword,
                valid: true
            },
            message: 'Token is valid'
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}));

// Get current user profile
router.get('/me', asyncHandler(async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
        const decoded = jwt.verify(token, jwtSecret) as any;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            data: userWithoutPassword
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}));

export default router;
