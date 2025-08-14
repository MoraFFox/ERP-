import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all clients
router.get('/', asyncHandler(async (req, res) => {
    const clients = await prisma.client.findMany();
    res.json(clients);
}));

// Create new client
router.post('/', asyncHandler(async (req, res) => {
    const client = await prisma.client.create({
        data: req.body,
    });
    res.status(201).json(client);
}));

// Get client by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const client = await prisma.client.findUnique({
        where: { id: req.params.id },
    });
    if (!client) {
        res.status(404).json({ message: 'Client not found' });
        return;
    }
    res.json(client);
}));

// Update client
router.put('/:id', asyncHandler(async (req, res) => {
    const client = await prisma.client.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(client);
}));

// Delete client
router.delete('/:id', asyncHandler(async (req, res) => {
    await prisma.client.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
}));

export default router;
