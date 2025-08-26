import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all products with pagination and filtering
router.get('/', asyncHandler(async (req, res) => {
    const {
        search,
        category,
        minPrice,
        maxPrice,
        page = 1,
        limit = 12,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where conditions
    const where: any = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
        ];
    }

    if (category) {
        where.category = category;
    }

    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) {
            where.price.gte = parseFloat(minPrice as string);
        }
        if (maxPrice) {
            where.price.lte = parseFloat(maxPrice as string);
        }
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take,
            orderBy: { [sortBy as string]: sortOrder }
        }),
        prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
        success: true,
        data: {
            items: products,
            pagination: {
                page: Number(page),
                limit: take,
                total,
                totalPages
            }
        },
        message: 'Products fetched successfully'
    });
}));

// Create new product
router.post('/', asyncHandler(async (req, res) => {
    const product = await prisma.product.create({
        data: req.body,
    });
    res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully'
    });
}));

// Get all unique categories (must come before /:id route)
router.get('/categories', asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany({
        select: {
            category: true
        },
        where: {
            category: {
                not: null
            }
        }
    });

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    res.json({
        success: true,
        data: categories,
        message: 'Categories fetched successfully'
    });
}));

// Get product by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
        where: { id: req.params.id },
    });
    if (!product) {
        res.status(404).json({
            success: false,
            message: 'Product not found'
        });
        return;
    }
    res.json({
        success: true,
        data: product,
        message: 'Product fetched successfully'
    });
}));

// Update product
router.put('/:id', asyncHandler(async (req, res) => {
    const product = await prisma.product.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json({
        success: true,
        data: product,
        message: 'Product updated successfully'
    });
}));

// Delete product
router.delete('/:id', asyncHandler(async (req, res) => {
    await prisma.product.delete({
        where: { id: req.params.id },
    });
    res.json({
        success: true,
        message: 'Product deleted successfully'
    });
}));

export default router;
