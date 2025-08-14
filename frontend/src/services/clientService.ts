import { apiRequest } from "./api"
import type { Client, ApiResponse, PaginatedResponse } from "@/types"

export interface CreateClientData {
  name: string
  email: string
  phone?: string
  businessId?: string
  taxNumber?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  website?: string
  industry?: string
  companySize?: string
  monthlyConsumption?: number
  productIds?: string[]
  notes?: string
  branchInfo?: {
    branchName?: string
    branchAddress?: string
    branchContact?: string
  }
}

export interface ClientFilters {
  search?: string
  status?: string
  industry?: string
  companySize?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface ContractResponse {
  contractUrl: string
  contractId: string
}

export const clientService = {
  async getClients(filters: ClientFilters = {}): Promise<PaginatedResponse<Client>> {
    const response = await apiRequest.get("/api/clients", filters)
    return response
  },

  async getClient(id: string): Promise<Client> {
    const response: ApiResponse<Client> = await apiRequest.get(`/api/clients/${id}`)

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch client")
    }

    return response.data
  },

  async createClient(data: CreateClientData): Promise<{ client: Client; contract?: ContractResponse }> {
    const response: ApiResponse<{ client: Client; contract?: ContractResponse }> = await apiRequest.post(
      "/api/clients",
      data,
    )

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to create client")
    }

    return response.data
  },

  async updateClient(id: string, data: Partial<CreateClientData>): Promise<Client> {
    const response: ApiResponse<Client> = await apiRequest.put(`/api/clients/${id}`, data)

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to update client")
    }

    return response.data
  },

  async deleteClient(id: string): Promise<void> {
    const response: ApiResponse<void> = await apiRequest.delete(`/api/clients/${id}`)

    if (!response.success) {
      throw new Error(response.message || "Failed to delete client")
    }
  },

  async uploadClientFiles(clientId: string, files: File[]): Promise<string[]> {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files`, file)
    })

    const response: ApiResponse<{ urls: string[] }> = await apiRequest.post(
      `/api/clients/${clientId}/files`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    )

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to upload files")
    }

    return response.data.urls
  },
}
