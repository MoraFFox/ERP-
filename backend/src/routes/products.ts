import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all products
router.get('/', asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
}));

// Create new product
router.post('/', asyncHandler(async (req, res) => {
    const product = await prisma.product.create({
        data: req.body,
    });
    res.status(201).json(product);
}));

// Get product by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
        where: { id: req.params.id },
    });
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
    }
    res.json(product);
}));

// Update product
router.put('/:id', asyncHandler(async (req, res) => {
    const product = await prisma.product.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json(product);
}));

// Delete product
router.delete('/:id', asyncHandler(async (req, res) => {
    await prisma.product.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
}));

export default router;
