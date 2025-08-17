import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { validateUser } from '../validation/auth';

const router = Router();
const prisma = new PrismaClient();

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
            return res.status(409).json({
                success: false,
                message: existingUser.email === email
                    ? 'Email already registered'
                    : 'Username already taken'
            });
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

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            success: true,
            data: {
                user: userWithoutPassword,
                accessToken: 'dummy-access-token',
                refreshToken: 'dummy-refresh-token'
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

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
        return;
    }

    // TODO: Add password verification and JWT token generation
    res.status(200).json({
        success: true,
        data: {
            user,
            accessToken: 'dummy-access-token',
            refreshToken: 'dummy-refresh-token'
        },
        message: 'Login successful'
    });
}));

export default router;
