import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { validateUser } from '../validation/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/register', validateUser, asyncHandler(async (req, res) => {
    const user = await prisma.user.create({
        data: req.body,
    });
    res.status(201).json(user);
}));

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    // TODO: Add password verification and JWT token generation
    res.status(200).json({ token: 'dummy-token' });
}));

export default router;
