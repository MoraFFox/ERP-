import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all clients
router.get('/', asyncHandler(async (req, res) => {
    const clients = await prisma.client.findMany();
    res.json({
        success: true,
        data: clients,
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
