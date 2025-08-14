import { apiRequest } from "./api"
import type { Order, ApiResponse, PaginatedResponse } from "@/types"

export interface CreateOrderData {
  orderDate: string
  clientId: string
  items: {
    productId: string
    quantity: number
    unitPrice?: number
  }[]
  deliveryInfo?: string
  receiverContact?: string
  notes?: string
}

export interface OrderFilters {
  search?: string
  status?: string
  clientId?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface OrderResponse {
  order: Order
  pdfUrl?: string
  orderId: string
}

export const orderService = {
  async getOrders(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    const response = await apiRequest.get("/api/orders", filters)
    return response
  },

  async getOrder(id: string): Promise<Order> {
    const response: ApiResponse<Order> = await apiRequest.get(`/api/orders/${id}`)

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch order")
    }

    return response.data
  },

  async createOrder(data: CreateOrderData): Promise<OrderResponse> {
    const response: ApiResponse<OrderResponse> = await apiRequest.post("/api/orders", data)

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to create order")
    }

    return response.data
  },

  async updateOrder(id: string, data: Partial<CreateOrderData>): Promise<Order> {
    const response: ApiResponse<Order> = await apiRequest.put(`/api/orders/${id}`, data)

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to update order")
    }

    return response.data
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const response: ApiResponse<Order> = await apiRequest.put(`/api/orders/${id}/status`, { status })

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to update order status")
    }

    return response.data
  },

  async deleteOrder(id: string): Promise<void> {
    const response: ApiResponse<void> = await apiRequest.delete(`/api/orders/${id}`)

    if (!response.success) {
      throw new Error(response.message || "Failed to delete order")
    }
  },

  async getOrderPdf(id: string): Promise<string> {
    const response: ApiResponse<{ pdfUrl: string }> = await apiRequest.get(`/api/orders/${id}/pdf`)

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to get order PDF")
    }

    return response.data.pdfUrl
  },
}
