"use client"

import { useState, useEffect } from "react"
import { orderService, type OrderFilters } from "@/services/orderService"
import type { Order } from "@/types"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Search, Filter, Eye, Edit, Download, Package, Calendar, User } from "lucide-react"

interface OrderListProps {
  onOrderSelect?: (order: Order) => void
  onOrderEdit?: (order: Order) => void
}

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
]

export const OrderList = ({ onOrderSelect, onOrderEdit }: OrderListProps) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await orderService.getOrders(filters)
      setOrders(response.data.items)
      setPagination(response.data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [filters])

  const handleFilterChange = (key: keyof OrderFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleDownloadPdf = async (orderId: string) => {
    try {
      const pdfUrl = await orderService.getOrderPdf(orderId)
      window.open(pdfUrl, "_blank")
    } catch (err) {
      console.error("Failed to download PDF:", err)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      PROCESSING: "bg-purple-100 text-purple-800",
      SHIPPED: "bg-indigo-100 text-indigo-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    }

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles] || statusStyles.PENDING} variant="outline">
        {status}
      </Badge>
    )
  }

  if (loading && orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <Select
              options={statusOptions}
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            />

            <Input
              type="date"
              placeholder="Start Date"
              value={filters.startDate || ""}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />

            <Input
              type="date"
              placeholder="End Date"
              value={filters.endDate || ""}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {error && <Alert variant="destructive">{error}</Alert>}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                  <div className="flex items-center mt-1 space-x-4">
                    {getStatusBadge(order.status)}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      {formatDate(order.orderDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="mr-1 h-4 w-4" />
                      {order.client.name}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => onOrderSelect?.(order)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onOrderEdit?.(order)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownloadPdf(order.id)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-1">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Package className="mr-2 h-3 w-3 text-gray-400" />
                          <span>{item.product.name}</span>
                          <span className="text-gray-500 ml-2">× {item.quantity}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-sm text-gray-500">+{order.items.length - 3} more items</div>
                    )}
                  </div>
                </div>

                {/* Delivery Info */}
                {order.deliveryInfo && (
                  <div>
                    <h4 className="text-sm font-medium">Delivery Info</h4>
                    <p className="text-sm text-gray-600">{order.deliveryInfo}</p>
                  </div>
                )}

                {/* Order Total */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-gray-600">Created {formatDate(order.createdAt)}</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.status || filters.startDate || filters.endDate
                ? "Try adjusting your filters"
                : "Get started by creating your first order"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
