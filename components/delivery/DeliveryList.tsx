"use client"

import { useState, useEffect } from "react"
import { Truck, Calendar, User, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface DeliverySchedule {
  id: string
  deliveryDate: string
  assignedDriver?: string
  status: "SCHEDULED" | "IN_PROGRESS" | "DELIVERED" | "MISSED" | "CANCELLED"
  notes?: string
  order: {
    id: string
    orderNumber: string
    totalAmount: number
    client: {
      name: string
      address?: string
      phone?: string
    }
    orderItems: Array<{
      quantity: number
      product: {
        name: string
      }
    }>
  }
}

interface DeliveryFilters {
  status?: string
  assignedDriver?: string
  startDate?: string
  endDate?: string
}

export default function DeliveryList() {
  const [deliveries, setDeliveries] = useState<DeliverySchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<DeliveryFilters>({})
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchDeliveries()
  }, [filters, pagination.page])

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters,
      })

      const response = await fetch(`/api/deliveries?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDeliveries(data.data.deliveries)
        setPagination((prev) => ({ ...prev, ...data.data.pagination }))
      }
    } catch (error) {
      console.error("Failed to fetch deliveries:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateDeliveryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/deliveries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchDeliveries()
      }
    } catch (error) {
      console.error("Failed to update delivery status:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "IN_PROGRESS":
        return <Truck className="w-4 h-4 text-yellow-600" />
      case "DELIVERED":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "MISSED":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200"
      case "MISSED":
        return "bg-red-100 text-red-800 border-red-200"
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            Delivery Schedule
          </h2>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.status || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value || undefined }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DELIVERED">Delivered</option>
            <option value="MISSED">Missed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <input
            type="text"
            placeholder="Driver name"
            value={filters.assignedDriver || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, assignedDriver: e.target.value || undefined }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />

          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value || undefined }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />

          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value || undefined }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Delivery List */}
      <div className="divide-y divide-gray-200">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(delivery.status)}`}
                  >
                    {getStatusIcon(delivery.status)}
                    {delivery.status.replace("_", " ")}
                  </span>
                  <span className="text-sm text-gray-500">Order #{delivery.order.orderNumber}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{delivery.order.client.name}</h3>
                    {delivery.order.client.address && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {delivery.order.client.address}
                      </p>
                    )}
                    {delivery.order.client.phone && (
                      <p className="text-sm text-gray-600">{delivery.order.client.phone}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(delivery.deliveryDate).toLocaleDateString()}
                    </p>
                    {delivery.assignedDriver && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {delivery.assignedDriver}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">${delivery.order.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{delivery.order.orderItems.length} item(s)</p>
                  </div>
                </div>

                {delivery.notes && <p className="text-sm text-gray-600 mt-2 italic">{delivery.notes}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                {delivery.status === "SCHEDULED" && (
                  <button
                    onClick={() => updateDeliveryStatus(delivery.id, "IN_PROGRESS")}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    Start Delivery
                  </button>
                )}
                {delivery.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => updateDeliveryStatus(delivery.id, "DELIVERED")}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} deliveries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
