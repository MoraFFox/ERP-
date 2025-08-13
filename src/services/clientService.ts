import { PrismaClient } from "@prisma/client"
import type { CreateClientRequest, UpdateClientRequest, ClientResponse, ClientListResponse } from "../types/client"
import { createError } from "../middleware/errorHandler"

const prisma = new PrismaClient()

export class ClientService {
  static async createClient(data: CreateClientRequest, createdById: string): Promise<ClientResponse> {
    // Check if client with email already exists
    const existingClient = await prisma.client.findUnique({
      where: { email: data.email },
    })

    if (existingClient) {
      throw createError("Client with this email already exists", 409)
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
    })

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone ?? undefined,
      address: client.address ?? undefined,
      city: client.city ?? undefined,
      state: client.state ?? undefined,
      zipCode: client.zipCode ?? undefined,
      country: client.country,
      website: client.website ?? undefined,
      industry: client.industry ?? undefined,
      companySize: client.companySize ?? undefined,
      status: client.status,
      notes: client.notes ?? undefined,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      createdBy: client.createdBy,
    }
  }

  static async getClientById(id: string): Promise<ClientResponse> {
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
    })

    if (!client) {
      throw createError("Client not found", 404)
    }

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone ?? undefined,
      address: client.address ?? undefined,
      city: client.city ?? undefined,
      state: client.state ?? undefined,
      zipCode: client.zipCode ?? undefined,
      country: client.country,
      website: client.website ?? undefined,
      industry: client.industry ?? undefined,
      companySize: client.companySize ?? undefined,
      status: client.status,
      notes: client.notes ?? undefined,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      createdBy: client.createdBy,
    }
  }

  static async getClients(query: any): Promise<ClientListResponse> {
    const { page, limit, search, status, industry, sortBy, sortOrder } = query

    const skip = (page - 1) * limit
    const where: any = {}

    // Build search conditions
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (industry) {
      where.industry = { contains: industry, mode: "insensitive" }
    }

    // Get total count
    const total = await prisma.client.count({ where })

    // Get clients
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
    })

    const formattedClients: ClientResponse[] = clients.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone ?? undefined,
      address: client.address ?? undefined,
      city: client.city ?? undefined,
      state: client.state ?? undefined,
      zipCode: client.zipCode ?? undefined,
      country: client.country,
      website: client.website ?? undefined,
      industry: client.industry ?? undefined,
      companySize: client.companySize ?? undefined,
      status: client.status,
      notes: client.notes ?? undefined,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      createdBy: client.createdBy,
    }))

    return {
      clients: formattedClients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async updateClient(id: string, data: UpdateClientRequest): Promise<ClientResponse> {
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id },
    })

    if (!existingClient) {
      throw createError("Client not found", 404)
    }

    // Check if email is being updated and already exists
    if (data.email && data.email !== existingClient.email) {
      const emailExists = await prisma.client.findUnique({
        where: { email: data.email },
      })

      if (emailExists) {
        throw createError("Client with this email already exists", 409)
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
    })

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone ?? undefined,
      address: client.address ?? undefined,
      city: client.city ?? undefined,
      state: client.state ?? undefined,
      zipCode: client.zipCode ?? undefined,
      country: client.country,
      website: client.website ?? undefined,
      industry: client.industry ?? undefined,
      companySize: client.companySize ?? undefined,
      status: client.status,
      notes: client.notes ?? undefined,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      createdBy: client.createdBy,
    }
  }

  static async deleteClient(id: string): Promise<void> {
    const client = await prisma.client.findUnique({
      where: { id },
    })

    if (!client) {
      throw createError("Client not found", 404)
    }

    await prisma.client.delete({
      where: { id },
    })
  }
}
