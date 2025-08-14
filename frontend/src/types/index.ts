export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: {
    id: string
    name: string
    permissions: string[]
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  roleId?: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  website?: string
  industry?: string
  companySize?: string
  status: "ACTIVE" | "INACTIVE" | "PROSPECT" | "CHURNED"
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    firstName: string
    lastName: string
  }
}

export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  category: string
  price: number
  cost?: number
  stockLevel: number
  minStock: number
  maxStock?: number
  unit: string
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderDate: string
  clientId: string
  client: Client
  items: OrderItem[]
  totalAmount: number
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  deliveryInfo?: string
  receiverContact?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    items: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}
