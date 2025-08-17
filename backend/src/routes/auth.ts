import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { validateUser } from '../validation/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/register', validateUser, asyncHandler(async (req, res) => {
    const user = await prisma.user.create({
        data: req.body,
    });
    res.status(201).json({
        success: true,
        data: {
            user,
            accessToken: 'dummy-access-token',
            refreshToken: 'dummy-refresh-token'
        },
        message: 'User registered successfully'
    });
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
