import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create maintenance visit
router.post('/', asyncHandler(async (req, res) => {
    const { 
        clientId, 
        productId, 
        technicianId, 
        visitType, 
        scheduledDate, 
        duration, 
        description, 
        location,
        notes 
    } = req.body;

    const maintenanceVisit = await prisma.maintenanceVisit.create({
        data: {
            clientId,
            productId,
            technicianId,
            visitType,
            scheduledDate: new Date(scheduledDate),
            duration,
            description,
            location,
            notes,
            status: 'SCHEDULED'
        },
        include: {
            client: true,
            product: true,
            technician: {
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
        data: maintenanceVisit,
        message: 'Maintenance visit scheduled successfully'
    });
}));

// Get maintenance visits with filtering
router.get('/', asyncHandler(async (req, res) => {
    const { 
        status, 
        technicianId, 
        clientId, 
        visitType,
        startDate, 
        endDate,
        page = 1, 
        limit = 20 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (status) where.status = status;
    if (technicianId) where.technicianId = technicianId;
    if (clientId) where.clientId = clientId;
    if (visitType) where.visitType = visitType;
    
    if (startDate || endDate) {
        where.scheduledDate = {};
        if (startDate) where.scheduledDate.gte = new Date(startDate as string);
        if (endDate) where.scheduledDate.lte = new Date(endDate as string);
    }

    const [visits, total] = await Promise.all([
        prisma.maintenanceVisit.findMany({
            where,
            skip,
            take,
            orderBy: { scheduledDate: 'asc' },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true
                    }
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        category: true
                    }
                },
                technician: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        }),
        prisma.maintenanceVisit.count({ where })
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

// Get maintenance visit by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const visit = await prisma.maintenanceVisit.findUnique({
        where: { id },
        include: {
            client: true,
            product: true,
            technician: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });

    if (!visit) {
        res.status(404).json({
            success: false,
            message: 'Maintenance visit not found'
        });
        return;
    }

    res.json({
        success: true,
        data: visit
    });
}));

// Update maintenance visit status
router.put('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { 
        status, 
        completedDate, 
        findings, 
        actions, 
        cost, 
        notes,
        duration 
    } = req.body;

    const updateData: any = {};
    
    if (status) updateData.status = status;
    if (completedDate) updateData.completedDate = new Date(completedDate);
    if (findings) updateData.findings = findings;
    if (actions) updateData.actions = actions;
    if (cost !== undefined) updateData.cost = cost;
    if (notes) updateData.notes = notes;
    if (duration) updateData.duration = duration;

    const visit = await prisma.maintenanceVisit.update({
        where: { id },
        data: updateData,
        include: {
            client: true,
            product: true,
            technician: {
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
        data: visit,
        message: 'Maintenance visit updated successfully'
    });
}));

// Get calendar data for maintenance visits
router.get('/calendar/data', asyncHandler(async (req, res) => {
    const { startDate, endDate, technicianId } = req.query;

    const where: any = {};
    
    if (startDate || endDate) {
        where.scheduledDate = {};
        if (startDate) where.scheduledDate.gte = new Date(startDate as string);
        if (endDate) where.scheduledDate.lte = new Date(endDate as string);
    }
    
    if (technicianId) where.technicianId = technicianId;

    const visits = await prisma.maintenanceVisit.findMany({
        where,
        orderBy: { scheduledDate: 'asc' },
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                    address: true
                }
            },
            technician: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    // Format for calendar display
    const calendarEvents = visits.map(visit => ({
        id: visit.id,
        title: `${visit.visitType} - ${visit.client.name}`,
        start: visit.scheduledDate,
        end: visit.duration ? 
            new Date(visit.scheduledDate.getTime() + visit.duration * 60000) : 
            new Date(visit.scheduledDate.getTime() + 120 * 60000), // Default 2 hours
        status: visit.status,
        technician: `${visit.technician.firstName} ${visit.technician.lastName}`,
        client: visit.client.name,
        address: visit.client.address,
        visitType: visit.visitType,
        location: visit.location
    }));

    res.json({
        success: true,
        data: calendarEvents
    });
}));

// Route optimization for technicians
router.get('/routes/optimize', asyncHandler(async (req, res) => {
    const { technicianId, date } = req.query;

    if (!technicianId || !date) {
        res.status(400).json({
            success: false,
            message: 'technicianId and date are required'
        });
        return;
    }

    const startDate = new Date(date as string);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const visits = await prisma.maintenanceVisit.findMany({
        where: {
            technicianId: technicianId as string,
            scheduledDate: {
                gte: startDate,
                lt: endDate
            },
            status: {
                in: ['SCHEDULED', 'IN_PROGRESS']
            }
        },
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                    address: true,
                    city: true,
                    state: true,
                    zipCode: true
                }
            }
        },
        orderBy: { scheduledDate: 'asc' }
    });

    // Simple route optimization (in production, use Google Maps Distance Matrix API)
    // For now, just sort by proximity/address patterns
    const optimizedRoute = visits.sort((a, b) => {
        // Simple heuristic: sort by zip code if available
        if (a.client.zipCode && b.client.zipCode) {
            return a.client.zipCode.localeCompare(b.client.zipCode);
        }
        return a.scheduledDate.getTime() - b.scheduledDate.getTime();
    });

    const routeData = optimizedRoute.map((visit, index) => ({
        order: index + 1,
        visitId: visit.id,
        client: visit.client.name,
        address: `${visit.client.address}, ${visit.client.city}, ${visit.client.state} ${visit.client.zipCode}`,
        scheduledTime: visit.scheduledDate,
        duration: visit.duration || 120,
        visitType: visit.visitType,
        status: visit.status,
        location: visit.location,
        estimatedTravelTime: index === 0 ? 0 : 15 // Simple estimate
    }));

    const totalDistance = routeData.length * 5; // Simple estimation
    const totalTravelTime = routeData.reduce((sum, stop) => sum + (stop.estimatedTravelTime || 0), 0);

    res.json({
        success: true,
        data: {
            optimizedRoute: routeData,
            summary: {
                totalStops: routeData.length,
                estimatedDistance: `${totalDistance} km`,
                estimatedTravelTime: `${totalTravelTime} minutes`,
                startTime: routeData[0]?.scheduledTime,
                endTime: routeData[routeData.length - 1]?.scheduledTime
            }
        }
    });
}));

// Get maintenance statistics
router.get('/stats', asyncHandler(async (req, res) => {
    const { startDate, endDate, technicianId } = req.query;

    const where: any = {};
    
    if (startDate || endDate) {
        where.scheduledDate = {};
        if (startDate) where.scheduledDate.gte = new Date(startDate as string);
        if (endDate) where.scheduledDate.lte = new Date(endDate as string);
    }
    
    if (technicianId) where.technicianId = technicianId;

    const [
        totalVisits,
        completedVisits,
        pendingVisits,
        cancelledVisits,
        visitsByType,
        avgCost
    ] = await Promise.all([
        prisma.maintenanceVisit.count({ where }),
        prisma.maintenanceVisit.count({ where: { ...where, status: 'COMPLETED' } }),
        prisma.maintenanceVisit.count({ where: { ...where, status: { in: ['SCHEDULED', 'IN_PROGRESS'] } } }),
        prisma.maintenanceVisit.count({ where: { ...where, status: 'CANCELLED' } }),
        prisma.maintenanceVisit.groupBy({
            by: ['visitType'],
            where,
            _count: true
        }),
        prisma.maintenanceVisit.aggregate({
            where: { ...where, cost: { not: null } },
            _avg: { cost: true }
        })
    ]);

    const completionRate = totalVisits > 0 ? (completedVisits / totalVisits * 100).toFixed(1) : '0';

    res.json({
        success: true,
        data: {
            overview: {
                totalVisits,
                completedVisits,
                pendingVisits,
                cancelledVisits,
                completionRate: `${completionRate}%`
            },
            visitsByType: visitsByType.map(item => ({
                type: item.visitType,
                count: item._count
            })),
            averageCost: avgCost._avg.cost || 0
        }
    });
}));

export default router;
