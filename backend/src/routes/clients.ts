import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all clients with pagination and filtering
router.get('/', asyncHandler(async (req, res) => {
    const {
        search,
        status,
        companySize,
        industry,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where conditions
    const where: any = {};

    if (search) {
        where.OR = [
            { name: { contains: search } },
            { email: { contains: search } }
        ];
    }

    const [clients, total] = await Promise.all([
        prisma.client.findMany({
            where,
            skip,
            take,
            orderBy: { [sortBy as string]: sortOrder }
        }),
        prisma.client.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
        success: true,
        data: {
            items: clients,
            pagination: {
                page: Number(page),
                limit: take,
                total,
                totalPages
            }
        },
        message: 'Clients fetched successfully'
    });
}));

// Create new client
router.post('/', asyncHandler(async (req, res) => {
    const client = await prisma.client.create({
        data: req.body,
    });
    res.status(201).json({
        success: true,
        data: client,
        message: 'Client created successfully'
    });
}));

// Get client by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const client = await prisma.client.findUnique({
        where: { id: req.params.id },
    });
    if (!client) {
        res.status(404).json({
            success: false,
            message: 'Client not found'
        });
        return;
    }
    res.json({
        success: true,
        data: client,
        message: 'Client fetched successfully'
    });
}));

// Update client
router.put('/:id', asyncHandler(async (req, res) => {
    const client = await prisma.client.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json({
        success: true,
        data: client,
        message: 'Client updated successfully'
    });
}));

// Delete client
router.delete('/:id', asyncHandler(async (req, res) => {
    await prisma.client.delete({
        where: { id: req.params.id },
    });
    res.json({
        success: true,
        message: 'Client deleted successfully'
    });
}));

export default router;
