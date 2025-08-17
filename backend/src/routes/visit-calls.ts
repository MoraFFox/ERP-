import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Log a new visit or call
router.post('/', asyncHandler(async (req, res) => {
    const { 
        clientId, 
        salespersonId, 
        type, 
        purpose, 
        outcome, 
        followUpDate, 
        distanceKm, 
        notes,
        visitDate 
    } = req.body;

    const visitCall = await prisma.visitCall.create({
        data: {
            clientId,
            salespersonId,
            type,
            purpose,
            outcome,
            followUpDate: followUpDate ? new Date(followUpDate) : null,
            distanceKm: distanceKm ? parseFloat(distanceKm) : null,
            notes,
            visitDate: visitDate ? new Date(visitDate) : new Date()
        },
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    city: true,
                    state: true
                }
            },
            salesperson: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });

    res.status(201).json({
        success: true,
        data: visitCall,
        message: 'Visit/call logged successfully'
    });
}));

// Get visit/call logs with filtering
router.get('/', asyncHandler(async (req, res) => {
    const { 
        clientId, 
        salespersonId, 
        type, 
        startDate, 
        endDate,
        page = 1, 
        limit = 20 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (clientId) where.clientId = clientId;
    if (salespersonId) where.salespersonId = salespersonId;
    if (type) where.type = type;
    
    if (startDate || endDate) {
        where.visitDate = {};
        if (startDate) where.visitDate.gte = new Date(startDate as string);
        if (endDate) where.visitDate.lte = new Date(endDate as string);
    }

    const [visits, total] = await Promise.all([
        prisma.visitCall.findMany({
            where,
            skip,
            take,
            orderBy: { visitDate: 'desc' },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                        city: true,
                        state: true
                    }
                },
                salesperson: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        }),
        prisma.visitCall.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
        success: true,
        data: {
            visits,
            pagination: {
                page: Number(page),
                limit: take,
                total,
                totalPages
            }
        }
    });
}));

// Get visit/call by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const visitCall = await prisma.visitCall.findUnique({
        where: { id },
        include: {
            client: true,
            salesperson: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });

    if (!visitCall) {
        res.status(404).json({
            success: false,
            message: 'Visit/call record not found'
        });
        return;
    }

    res.json({
        success: true,
        data: visitCall
    });
}));

// Get visit history for a specific client
router.get('/client/:clientId', asyncHandler(async (req, res) => {
    const { clientId } = req.params;
    const { limit = 10 } = req.query;

    const visits = await prisma.visitCall.findMany({
        where: { clientId },
        take: Number(limit),
        orderBy: { visitDate: 'desc' },
        include: {
            salesperson: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });

    // Calculate total distance traveled for this client
    const totalDistance = await prisma.visitCall.aggregate({
        where: { 
            clientId,
            distanceKm: { not: null }
        },
        _sum: { distanceKm: true },
        _count: { distanceKm: true }
    });

    res.json({
        success: true,
        data: {
            visits,
            summary: {
                totalVisits: visits.length,
                totalDistance: totalDistance._sum.distanceKm || 0,
                averageDistance: totalDistance._count.distanceKm > 0 ? 
                    (totalDistance._sum.distanceKm || 0) / totalDistance._count.distanceKm : 0
            }
        }
    });
}));

// Get visit history for a specific client with pagination
router.get('/client/:clientId/history', asyncHandler(async (req, res) => {
    const { clientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [visits, total] = await Promise.all([
        prisma.visitCall.findMany({
            where: { clientId },
            skip,
            take,
            orderBy: { visitDate: 'desc' },
            include: {
                salesperson: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        }),
        prisma.visitCall.count({ where: { clientId } })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
        success: true,
        data: {
            visits,
            pagination: {
                page: Number(page),
                limit: take,
                total,
                totalPages
            }
        }
    });
}));

// Update visit/call record
router.put('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { 
        outcome, 
        followUpDate, 
        notes, 
        distanceKm 
    } = req.body;

    const updateData: any = {};
    
    if (outcome) updateData.outcome = outcome;
    if (followUpDate !== undefined) updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
    if (notes) updateData.notes = notes;
    if (distanceKm !== undefined) updateData.distanceKm = distanceKm ? parseFloat(distanceKm) : null;

    const visitCall = await prisma.visitCall.update({
        where: { id },
        data: updateData,
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            salesperson: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });

    res.json({
        success: true,
        data: visitCall,
        message: 'Visit/call record updated successfully'
    });
}));

// Delete visit/call record
router.delete('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.visitCall.delete({
        where: { id }
    });

    res.json({
        success: true,
        message: 'Visit/call record deleted successfully'
    });
}));

// Get visit/call statistics
router.get('/stats', asyncHandler(async (req, res) => {
    const { startDate, endDate, salespersonId, clientId } = req.query;

    const where: any = {};
    
    if (startDate || endDate) {
        where.visitDate = {};
        if (startDate) where.visitDate.gte = new Date(startDate as string);
        if (endDate) where.visitDate.lte = new Date(endDate as string);
    }
    
    if (salespersonId) where.salespersonId = salespersonId;
    if (clientId) where.clientId = clientId;

    const [
        totalVisits,
        visitsByType,
        visitsBySalesperson,
        totalDistance,
        recentVisits,
        followUpsNeeded
    ] = await Promise.all([
        prisma.visitCall.count({ where }),
        prisma.visitCall.groupBy({
            by: ['type'],
            where,
            _count: true
        }),
        prisma.visitCall.groupBy({
            by: ['salespersonId'],
            where,
            _count: true,
            _sum: { distanceKm: true }
        }),
        prisma.visitCall.aggregate({
            where: { 
                ...where, 
                distanceKm: { not: null } 
            },
            _sum: { distanceKm: true },
            _avg: { distanceKm: true }
        }),
        prisma.visitCall.findMany({
            where,
            take: 5,
            orderBy: { visitDate: 'desc' },
            include: {
                client: {
                    select: {
                        name: true
                    }
                },
                salesperson: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        }),
        prisma.visitCall.count({
            where: {
                ...where,
                followUpDate: {
                    lte: new Date(),
                    not: null
                },
                outcome: {
                    not: 'Completed'
                }
            }
        })
    ]);

    // Get salesperson details for the grouped data
    const salespersonIds = visitsBySalesperson.map(item => item.salespersonId);
    const salespersonDetails = await prisma.user.findMany({
        where: {
            id: { in: salespersonIds }
        },
        select: {
            id: true,
            firstName: true,
            lastName: true
        }
    });

    const visitsBySalespersonWithNames = visitsBySalesperson.map(item => {
        const salesperson = salespersonDetails.find(sp => sp.id === item.salespersonId);
        return {
            salesperson: salesperson ? `${salesperson.firstName} ${salesperson.lastName}` : 'Unknown',
            visitCount: item._count,
            totalDistance: item._sum.distanceKm || 0
        };
    });

    res.json({
        success: true,
        data: {
            overview: {
                totalVisits,
                totalDistance: totalDistance._sum.distanceKm || 0,
                averageDistance: totalDistance._avg.distanceKm || 0,
                followUpsNeeded
            },
            visitsByType: visitsByType.map(item => ({
                type: item.type,
                count: item._count
            })),
            visitsBySalesperson: visitsBySalespersonWithNames,
            recentVisits: recentVisits.map(visit => ({
                id: visit.id,
                client: visit.client.name,
                salesperson: `${visit.salesperson.firstName} ${visit.salesperson.lastName}`,
                type: visit.type,
                visitDate: visit.visitDate,
                outcome: visit.outcome,
                distanceKm: visit.distanceKm
            }))
        }
    });
}));

// Get follow-up reminders
router.get('/follow-ups', asyncHandler(async (req, res) => {
    const { salespersonId, overdue = false } = req.query;

    const where: any = {
        followUpDate: { not: null }
    };

    if (salespersonId) where.salespersonId = salespersonId;

    if (overdue === 'true') {
        where.followUpDate = {
            ...where.followUpDate,
            lte: new Date()
        };
        where.outcome = {
            not: 'Completed'
        };
    }

    const followUps = await prisma.visitCall.findMany({
        where,
        orderBy: { followUpDate: 'asc' },
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            salesperson: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });

    res.json({
        success: true,
        data: followUps
    });
}));

// Mark follow-up as completed
router.put('/:id/complete-followup', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { outcome, notes } = req.body;

    const visitCall = await prisma.visitCall.update({
        where: { id },
        data: {
            outcome: outcome || 'Completed',
            notes: notes ? `${notes} (Follow-up completed)` : 'Follow-up completed',
            followUpDate: null // Clear the follow-up date
        },
        include: {
            client: {
                select: {
                    name: true
                }
            }
        }
    });

    res.json({
        success: true,
        data: visitCall,
        message: 'Follow-up marked as completed'
    });
}));

export default router;
