import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

// Create test user endpoint
router.post('/create-user', asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.json({
                success: true,
                message: 'User already exists',
                data: { email: existingUser.email }
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user with minimal required fields
        const user = await prisma.user.create({
            data: {
                email,
                username: email.split('@')[0], // Use email prefix as username
                password: hashedPassword,
                fullName: email.split('@')[0],
                firstName: email.split('@')[0],
                lastName: 'User'
            },
        });

        res.json({
            success: true,
            message: 'Test user created successfully',
            data: { 
                id: user.id,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Test user creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create test user',
            error: error.message
        });
    }
}));

// Check if user exists
router.get('/check-user/:email', asyncHandler(async (req, res) => {
    try {
        const { email } = req.params;
        
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                createdAt: true
            }
        });

        res.json({
            success: true,
            data: {
                exists: !!user,
                user: user || null
            }
        });
    } catch (error) {
        console.error('Check user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check user',
            error: error.message
        });
    }
}));

export default router;
