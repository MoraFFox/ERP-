import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all orders with pagination and filtering
router.get('/', asyncHandler(async (req, res) => {
    const { 
        search, 
        status, 
        clientId, 
        startDate, 
        endDate, 
        page = 1, 
        limit = 10, 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where conditions
    const where: any = {};
    
    if (status) {
        where.status = status;
    }
    
    if (clientId) {
        where.clientId = clientId;
    }
    
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
            where.createdAt.gte = new Date(startDate as string);
        }
        if (endDate) {
            where.createdAt.lte = new Date(endDate as string);
        }
    }
    
    if (search) {
        where.OR = [
            { client: { name: { contains: search, mode: 'insensitive' } } },
            { client: { email: { contains: search, mode: 'insensitive' } } }
        ];
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take,
            orderBy: { [sortBy as string]: sortOrder },
            include: {
                client: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        }),
        prisma.order.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
        success: true,
        data: {
            items: orders,
            pagination: {
                page: Number(page),
                limit: take,
                total,
                totalPages
            }
        },
        message: 'Orders fetched successfully'
    });
}));

// Create new order
router.post('/', asyncHandler(async (req, res) => {
    const { clientId, items, deliveryInfo, receiverContact, notes, orderDate } = req.body;

    try {
        // Calculate total amount
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) {
                res.status(400).json({
                    success: false,
                    message: `Product with ID ${item.productId} not found`
                });
                return;
            }

            const unitPrice = item.unitPrice || Number(product.price);
            const itemTotal = unitPrice * item.quantity;
            totalAmount += itemTotal;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: unitPrice
            });
        }

        // Create order with order items
        const order = await prisma.order.create({
            data: {
                clientId,
                totalAmount,
                status: 'PENDING',
                orderDate: orderDate ? new Date(orderDate) : new Date(),
                orderItems: {
                    create: orderItemsData
                }
            },
            include: {
                client: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            data: {
                order,
                orderId: order.id
            },
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
}));

// Get order by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: {
            client: true,
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) {
        res.status(404).json({
            success: false,
            message: 'Order not found'
        });
        return;
    }

    res.json({
        success: true,
        data: order,
        message: 'Order fetched successfully'
    });
}));

// Update order
router.put('/:id', asyncHandler(async (req, res) => {
    const { clientId, items, deliveryInfo, receiverContact, notes, orderDate } = req.body;

    try {
        // If items are being updated, recalculate total
        let updateData: any = { clientId };

        if (items && items.length > 0) {
            // Delete existing order items
            await prisma.orderItem.deleteMany({
                where: { orderId: req.params.id }
            });

            // Calculate new total and create new order items
            let totalAmount = 0;
            const orderItemsData = [];

            for (const item of items) {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId }
                });

                if (!product) {
                    res.status(400).json({
                        success: false,
                        message: `Product with ID ${item.productId} not found`
                    });
                    return;
                }

                const unitPrice = item.unitPrice || Number(product.price);
                const itemTotal = unitPrice * item.quantity;
                totalAmount += itemTotal;

                orderItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: unitPrice
                });
            }

            updateData.totalAmount = totalAmount;
            updateData.orderItems = {
                create: orderItemsData
            };
        }

        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: updateData,
            include: {
                client: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.json({
            success: true,
            data: order,
            message: 'Order updated successfully'
        });
    } catch (error) {
        console.error('Order update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
}));

// Update order status
router.put('/:id/status', asyncHandler(async (req, res) => {
    const { status } = req.body;

    const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status },
        include: {
            client: true,
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    res.json({
        success: true,
        data: order,
        message: 'Order status updated successfully'
    });
}));

// Delete order
router.delete('/:id', asyncHandler(async (req, res) => {
    // Delete order items first (cascade)
    await prisma.orderItem.deleteMany({
        where: { orderId: req.params.id }
    });

    // Delete order
    await prisma.order.delete({
        where: { id: req.params.id }
    });

    res.json({
        success: true,
        message: 'Order deleted successfully'
    });
}));

// Get order PDF (placeholder endpoint)
router.get('/:id/pdf', asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: {
            client: true,
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) {
        res.status(404).json({
            success: false,
            message: 'Order not found'
        });
        return;
    }

    // This is a placeholder - in a real app you'd generate a PDF
    const pdfUrl = `/api/orders/${req.params.id}/pdf-download`;

    res.json({
        success: true,
        data: { pdfUrl },
        message: 'PDF URL generated successfully'
    });
}));

export default router;
