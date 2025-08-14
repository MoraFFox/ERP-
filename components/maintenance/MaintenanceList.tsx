"use client"

import { useState, useEffect } from "react"
import { Wrench, Calendar, User, MapPin, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface MaintenanceVisit {
  id: string
  scheduledDate: string
  completedDate?: string
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "RESCHEDULED"
  visitType: "PREVENTIVE" | "CORRECTIVE" | "EMERGENCY" | "INSPECTION" | "INSTALLATION"
  description: string
  findings?: string
  actions?: string
  cost?: number
  duration?: number
  notes?: string
  client: {
    name: string
    address?: string
    phone?: string
  }
  technician: {
    firstName: string
    lastName: string
  }
  product?: {
    name: string
  }
}

interface MaintenanceFilters {
  status?: string
  visitType?: string
  technicianId?: string
  clientId?: string
  startDate?: string
  endDate?: string
}

export default function MaintenanceList() {
  const [visits, setVisits] = useState<MaintenanceVisit[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<MaintenanceFilters>({})
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchVisits()
  }, [filters, pagination.page])

  const fetchVisits = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters,
      })

      const response = await fetch(`/api/maintenance?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setVisits(data.data.visits)
        setPagination((prev) => ({ ...prev, ...data.data.pagination }))
      }
    } catch (error) {
      console.error("Failed to fetch maintenance visits:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateVisitStatus = async (id: string, status: string) => {
    try {
      const updateData: any = { status }
      if (status === "COMPLETED") {
        updateData.completedDate = new Date().toISOString()
      }

      const response = await fetch(`/api/maintenance/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        fetchVisits()
      }
    } catch (error) {
      console.error("Failed to update visit status:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "IN_PROGRESS":
        return <Wrench className="w-4 h-4 text-yellow-600" />
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "RESCHEDULED":
        return <AlertTriangle className="w-4 h-4 text-purple-600" />
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
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      case "RESCHEDULED":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getVisitTypeColor = (visitType: string) => {
    switch (visitType) {
      case "PREVENTIVE":
        return "bg-green-100 text-green-800"
      case "CORRECTIVE":
        return "bg-yellow-100 text-yellow-800"
      case "EMERGENCY":
        return "bg-red-100 text-red-800"
      case "INSPECTION":
        return "bg-blue-100 text-blue-800"
      case "INSTALLATION":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
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
            <Wrench className="w-5 h-5 text-amber-600" />
            Maintenance Schedule
          </h2>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={filters.status || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value || undefined }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RESCHEDULED">Rescheduled</option>
          </select>

          <select
            value={filters.visitType || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, visitType: e.target.value || undefined }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">All Types</option>
            <option value="PREVENTIVE">Preventive</option>
            <option value="CORRECTIVE">Corrective</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="INSPECTION">Inspection</option>
            <option value="INSTALLATION">Installation</option>
          </select>

          <input
            type="text"
            placeholder="Client name"
            value={filters.clientId || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, clientId: e.target.value || undefined }))}
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

      {/* Visits List */}
      <div className="divide-y divide-gray-200">
        {visits.map((visit) => (
          <div key={visit.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(visit.status)}`}
                  >
                    {getStatusIcon(visit.status)}
                    {visit.status.replace("_", " ")}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVisitTypeColor(visit.visitType)}`}>
                    {visit.visitType}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{visit.client.name}</h3>
                    {visit.client.address && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {visit.client.address}
                      </p>
                    )}
                    {visit.client.phone && <p className="text-sm text-gray-600">{visit.client.phone}</p>}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(visit.scheduledDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {visit.technician.firstName} {visit.technician.lastName}
                    </p>
                    {visit.product && <p className="text-sm text-gray-600">Product: {visit.product.name}</p>}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">{visit.description}</p>
                    {visit.cost && <p className="text-sm text-gray-600">Cost: ${visit.cost.toFixed(2)}</p>}
                    {visit.duration && <p className="text-sm text-gray-600">Duration: {visit.duration} min</p>}
                  </div>
                </div>

                {visit.findings && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Findings:</p>
                    <p className="text-sm text-blue-800">{visit.findings}</p>
                  </div>
                )}

                {visit.actions && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900 mb-1">Actions Taken:</p>
                    <p className="text-sm text-green-800">{visit.actions}</p>
                  </div>
                )}

                {visit.notes && <p className="text-sm text-gray-600 mt-2 italic">{visit.notes}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                {visit.status === "SCHEDULED" && (
                  <button
                    onClick={() => updateVisitStatus(visit.id, "IN_PROGRESS")}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    Start Visit
                  </button>
                )}
                {visit.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => updateVisitStatus(visit.id, "COMPLETED")}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Mark Complete
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
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} visits
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
