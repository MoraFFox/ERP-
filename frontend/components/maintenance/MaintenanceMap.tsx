"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Users, Clock } from "lucide-react"

interface MaintenanceVisit {
  id: string
  scheduledDate: string
  status: string
  visitType: string
  description: string
  location?: {
    lat: number
    lng: number
  }
  client: {
    name: string
    address?: string
  }
  technician: {
    firstName: string
    lastName: string
  }
}

export default function MaintenanceMap() {
  const [visits, setVisits] = useState<MaintenanceVisit[]>([])
  const [selectedTechnician, setSelectedTechnician] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVisits()
  }, [selectedTechnician, selectedDate])

  const fetchVisits = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        startDate: selectedDate,
        endDate: selectedDate,
        ...(selectedTechnician && { technicianId: selectedTechnician }),
      })

      const response = await fetch(`/api/maintenance?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setVisits(data.data.visits.filter((visit: MaintenanceVisit) => visit.location))
      }
    } catch (error) {
      console.error("Failed to fetch visits:", error)
    } finally {
      setLoading(false)
    }
  }

  const optimizeRoutes = async () => {
    if (!selectedTechnician) return

    try {
      const response = await fetch(
        `/api/maintenance/optimize-routes?technicianId=${selectedTechnician}&date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        console.log("Optimized routes:", data.data)
        // Here you would update the map with optimized routes
      }
    } catch (error) {
      console.error("Failed to optimize routes:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-500"
      case "IN_PROGRESS":
        return "bg-yellow-500"
      case "COMPLETED":
        return "bg-green-500"
      case "CANCELLED":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-100 rounded"></div>
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
            <MapPin className="w-5 h-5 text-amber-600" />
            Maintenance Map
          </h2>
          <button
            onClick={optimizeRoutes}
            disabled={!selectedTechnician}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Optimize Routes
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedTechnician}
            onChange={(e) => setSelectedTechnician(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">All Technicians</option>
            <option value="tech1">John Smith</option>
            <option value="tech2">Jane Doe</option>
            <option value="tech3">Mike Johnson</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Map Container */}
      <div className="p-6">
        <div className="relative h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Interactive Map View</p>
            <p className="text-sm text-gray-500">Map integration with Leaflet or Mapbox would be implemented here</p>
            <p className="text-sm text-gray-500 mt-2">Showing {visits.length} maintenance visits with location data</p>
          </div>

          {/* Mock map markers */}
          {visits.slice(0, 5).map((visit, index) => (
            <div
              key={visit.id}
              className={`absolute w-4 h-4 rounded-full ${getStatusColor(visit.status)} border-2 border-white shadow-lg`}
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + index * 10}%`,
              }}
              title={`${visit.client.name} - ${visit.status}`}
            />
          ))}
        </div>
      </div>

      {/* Visit List */}
      <div className="border-t border-gray-200 p-6">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Scheduled Visits ({visits.length})
        </h3>
        <div className="space-y-3">
          {visits.map((visit) => (
            <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(visit.status)}`} />
                <div>
                  <div className="font-medium text-gray-900">{visit.client.name}</div>
                  <div className="text-sm text-gray-600">{visit.description}</div>
                  {visit.client.address && <div className="text-sm text-gray-500">{visit.client.address}</div>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {visit.technician.firstName} {visit.technician.lastName}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(visit.scheduledDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
