import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get delivery schedules with filtering
router.get('/', asyncHandler(async (req, res) => {
    const { 
        status, 
        date, 
        startDate, 
        endDate,
        assignedDriver,
        page = 1, 
        limit = 20 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (status) where.status = status;
    if (assignedDriver) where.assignedDriver = assignedDriver;
    
    if (date) {
        const queryDate = new Date(date as string);
        const nextDay = new Date(queryDate);
        nextDay.setDate(nextDay.getDate() + 1);
        where.deliveryDate = {
            gte: queryDate,
            lt: nextDay
        };
    } else if (startDate || endDate) {
        where.deliveryDate = {};
        if (startDate) where.deliveryDate.gte = new Date(startDate as string);
        if (endDate) where.deliveryDate.lte = new Date(endDate as string);
    }

    const [deliveries, total] = await Promise.all([
        prisma.deliverySchedule.findMany({
            where,
            skip,
            take,
            orderBy: { deliveryDate: 'asc' },
            include: {
                order: {
                    include: {
                        client: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                                address: true,
                                city: true,
                                state: true,
                                zipCode: true
                            }
                        },
                        orderItems: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        category: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }),
        prisma.deliverySchedule.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
        success: true,
        data: {
            deliveries,
            pagination: {
                page: Number(page),
                limit: take,
                total,
                totalPages
            }
        }
    });
}));

// Get delivery schedule by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const delivery = await prisma.deliverySchedule.findUnique({
        where: { id },
        include: {
            order: {
                include: {
                    client: true,
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            }
        }
    });

    if (!delivery) {
        res.status(404).json({
            success: false,
            message: 'Delivery schedule not found'
        });
        return;
    }

    res.json({
        success: true,
        data: delivery
    });
}));

// Get delivery schedule by order ID
router.get('/order/:orderId', asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const delivery = await prisma.deliverySchedule.findFirst({
        where: { orderId },
        include: {
            order: {
                include: {
                    client: true,
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            }
        }
    });

    if (!delivery) {
        res.status(404).json({
            success: false,
            message: 'Delivery schedule not found for this order'
        });
        return;
    }

    res.json({
        success: true,
        data: delivery
    });
}));

// Create delivery schedule (usually called automatically when order is created)
router.post('/', asyncHandler(async (req, res) => {
    const { 
        orderId, 
        deliveryDate, 
        assignedDriver, 
        notes 
    } = req.body;

    // Check if order exists
    const order = await prisma.order.findUnique({
        where: { id: orderId }
    });

    if (!order) {
        res.status(404).json({
            success: false,
            message: 'Order not found'
        });
        return;
    }

    const delivery = await prisma.deliverySchedule.create({
        data: {
            orderId,
            deliveryDate: new Date(deliveryDate),
            assignedDriver,
            notes,
            status: 'SCHEDULED'
        },
        include: {
            order: {
                include: {
                    client: true,
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            }
        }
    });

    res.status(201).json({
        success: true,
        data: delivery,
        message: 'Delivery scheduled successfully'
    });
}));

// Update delivery schedule
router.put('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { 
        deliveryDate, 
        assignedDriver, 
        status, 
        notes 
    } = req.body;

    const updateData: any = {};
    
    if (deliveryDate) updateData.deliveryDate = new Date(deliveryDate);
    if (assignedDriver) updateData.assignedDriver = assignedDriver;
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;

    const delivery = await prisma.deliverySchedule.update({
        where: { id },
        data: updateData,
        include: {
            order: {
                include: {
                    client: true,
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            }
        }
    });

    res.json({
        success: true,
        data: delivery,
        message: 'Delivery schedule updated successfully'
    });
}));

// Reschedule delivery
router.put('/:id/reschedule', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { deliveryDate, reason } = req.body;

    if (!deliveryDate) {
        res.status(400).json({
            success: false,
            message: 'New delivery date is required'
        });
        return;
    }

    const delivery = await prisma.deliverySchedule.update({
        where: { id },
        data: {
            deliveryDate: new Date(deliveryDate),
            status: 'SCHEDULED',
            notes: reason ? `Rescheduled: ${reason}` : 'Delivery rescheduled'
        },
        include: {
            order: {
                include: {
                    client: true
                }
            }
        }
    });

    res.json({
        success: true,
        data: delivery,
        message: 'Delivery rescheduled successfully'
    });
}));

// Mark delivery as completed
router.put('/:id/complete', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { notes, deliveredBy } = req.body;

    const delivery = await prisma.deliverySchedule.update({
        where: { id },
        data: {
            status: 'DELIVERED',
            notes: notes || 'Delivery completed',
            ...(deliveredBy && { assignedDriver: deliveredBy })
        },
        include: {
            order: {
                include: {
                    client: true,
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            }
        }
    });

    // Also update the related order status
    await prisma.order.update({
        where: { id: delivery.orderId },
        data: { status: 'DELIVERED' }
    });

    res.json({
        success: true,
        data: delivery,
        message: 'Delivery marked as completed'
    });
}));

// Get calendar data for deliveries
router.get('/calendar/data', asyncHandler(async (req, res) => {
    const { startDate, endDate, driver } = req.query;

    const where: any = {};
    
    if (startDate || endDate) {
        where.deliveryDate = {};
        if (startDate) where.deliveryDate.gte = new Date(startDate as string);
        if (endDate) where.deliveryDate.lte = new Date(endDate as string);
    }
    
    if (driver) where.assignedDriver = driver;

    const deliveries = await prisma.deliverySchedule.findMany({
        where,
        orderBy: { deliveryDate: 'asc' },
        include: {
            order: {
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                            city: true,
                            state: true
                        }
                    },
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    category: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Format for calendar display
    const calendarEvents = deliveries.map(delivery => ({
        id: delivery.id,
        title: `Delivery - ${delivery.order.client.name}`,
        start: delivery.deliveryDate,
        end: new Date(delivery.deliveryDate.getTime() + 60 * 60000), // 1 hour duration
        status: delivery.status,
        driver: delivery.assignedDriver || 'Unassigned',
        client: delivery.order.client.name,
        address: `${delivery.order.client.address}, ${delivery.order.client.city}, ${delivery.order.client.state}`,
        orderNumber: delivery.order.orderNumber,
        itemCount: delivery.order.orderItems.length,
        notes: delivery.notes
    }));

    res.json({
        success: true,
        data: calendarEvents
    });
}));

// Get delivery statistics
router.get('/stats', asyncHandler(async (req, res) => {
    const { startDate, endDate, driver } = req.query;

    const where: any = {};
    
    if (startDate || endDate) {
        where.deliveryDate = {};
        if (startDate) where.deliveryDate.gte = new Date(startDate as string);
        if (endDate) where.deliveryDate.lte = new Date(endDate as string);
    }
    
    if (driver) where.assignedDriver = driver;

    const [
        totalDeliveries,
        completedDeliveries,
        pendingDeliveries,
        missedDeliveries,
        deliveriesByStatus,
        deliveriesByDriver
    ] = await Promise.all([
        prisma.deliverySchedule.count({ where }),
        prisma.deliverySchedule.count({ where: { ...where, status: 'DELIVERED' } }),
        prisma.deliverySchedule.count({ where: { ...where, status: { in: ['SCHEDULED', 'IN_PROGRESS'] } } }),
        prisma.deliverySchedule.count({ where: { ...where, status: 'MISSED' } }),
        prisma.deliverySchedule.groupBy({
            by: ['status'],
            where,
            _count: true
        }),
        prisma.deliverySchedule.groupBy({
            by: ['assignedDriver'],
            where: { ...where, assignedDriver: { not: null } },
            _count: true
        })
    ]);

    const deliveryRate = totalDeliveries > 0 ? (completedDeliveries / totalDeliveries * 100).toFixed(1) : '0';

    res.json({
        success: true,
        data: {
            overview: {
                totalDeliveries,
                completedDeliveries,
                pendingDeliveries,
                missedDeliveries,
                deliveryRate: `${deliveryRate}%`
            },
            deliveriesByStatus: deliveriesByStatus.map(item => ({
                status: item.status,
                count: item._count
            })),
            deliveriesByDriver: deliveriesByDriver.map(item => ({
                driver: item.assignedDriver,
                count: item._count
            }))
        }
    });
}));

// Get upcoming deliveries for today/tomorrow
router.get('/upcoming', asyncHandler(async (req, res) => {
    const { days = 1 } = req.query;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + Number(days));

    const deliveries = await prisma.deliverySchedule.findMany({
        where: {
            deliveryDate: {
                gte: today,
                lt: endDate
            },
            status: {
                in: ['SCHEDULED', 'IN_PROGRESS']
            }
        },
        orderBy: { deliveryDate: 'asc' },
        include: {
            order: {
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            address: true,
                            city: true,
                            state: true,
                            zipCode: true
                        }
                    },
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    category: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    res.json({
        success: true,
        data: deliveries
    });
}));

export default router;
