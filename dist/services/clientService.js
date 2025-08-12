"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
class ClientService {
    static async createClient(data, createdById) {
        const existingClient = await prisma.client.findUnique({
            where: { email: data.email },
        });
        if (existingClient) {
            throw (0, errorHandler_1.createError)("Client with this email already exists", 409);
        }
        const client = await prisma.client.create({
            data: {
                ...data,
                createdById,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return {
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            country: client.country,
            website: client.website,
            industry: client.industry,
            companySize: client.companySize,
            status: client.status,
            notes: client.notes,
            createdAt: client.createdAt.toISOString(),
            updatedAt: client.updatedAt.toISOString(),
            createdBy: client.createdBy,
        };
    }
    static async getClientById(id) {
        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        if (!client) {
            throw (0, errorHandler_1.createError)("Client not found", 404);
        }
        return {
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            country: client.country,
            website: client.website,
            industry: client.industry,
            companySize: client.companySize,
            status: client.status,
            notes: client.notes,
            createdAt: client.createdAt.toISOString(),
            updatedAt: client.updatedAt.toISOString(),
            createdBy: client.createdBy,
        };
    }
    static async getClients(query) {
        const { page, limit, search, status, industry, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
            ];
        }
        if (status) {
            where.status = status;
        }
        if (industry) {
            where.industry = { contains: industry, mode: "insensitive" };
        }
        const total = await prisma.client.count({ where });
        const clients = await prisma.client.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        const formattedClients = clients.map((client) => ({
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            country: client.country,
            website: client.website,
            industry: client.industry,
            companySize: client.companySize,
            status: client.status,
            notes: client.notes,
            createdAt: client.createdAt.toISOString(),
            updatedAt: client.updatedAt.toISOString(),
            createdBy: client.createdBy,
        }));
        return {
            clients: formattedClients,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async updateClient(id, data) {
        const existingClient = await prisma.client.findUnique({
            where: { id },
        });
        if (!existingClient) {
            throw (0, errorHandler_1.createError)("Client not found", 404);
        }
        if (data.email && data.email !== existingClient.email) {
            const emailExists = await prisma.client.findUnique({
                where: { email: data.email },
            });
            if (emailExists) {
                throw (0, errorHandler_1.createError)("Client with this email already exists", 409);
            }
        }
        const client = await prisma.client.update({
            where: { id },
            data,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return {
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            country: client.country,
            website: client.website,
            industry: client.industry,
            companySize: client.companySize,
            status: client.status,
            notes: client.notes,
            createdAt: client.createdAt.toISOString(),
            updatedAt: client.updatedAt.toISOString(),
            createdBy: client.createdBy,
        };
    }
    static async deleteClient(id) {
        const client = await prisma.client.findUnique({
            where: { id },
        });
        if (!client) {
            throw (0, errorHandler_1.createError)("Client not found", 404);
        }
        await prisma.client.delete({
            where: { id },
        });
    }
}
exports.ClientService = ClientService;
//# sourceMappingURL=clientService.js.map